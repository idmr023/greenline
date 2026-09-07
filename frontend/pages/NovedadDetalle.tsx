import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  Share2,
  Tag,
  ChevronUp,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import NovedadImagen from "../components/NovedadImagen";
import SEOHead, { articleSchema, breadcrumbSchema } from "../components/SEOHead";
import TextToVoice from "../components/TextToVoice";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string | null;
  content_text: string | null;
  image_url: string | null;
  image_alt: string | null;
  published_at: string | null;
  featured: boolean;
  category: string;
  category_slug: string;
  sort_order: number;
  gallery_images: { image_url: string; image_alt: string | null; caption: string | null; sort_order: number }[];
};

function cleanAlt(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "[]" || trimmed === "{}" || trimmed === "") return null;
  return trimmed;
}

function cleanText(value: string | null): string | null {
  if (!value) return null;
  return value.replace(/\t/g, " ").replace(/\s+/g, " ").trim() || null;
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function estimateReadingTime(html: string | null, text: string | null): number {
  const content = text ?? html?.replace(/<[^>]*>/g, " ") ?? "";
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const SHARE_BUTTONS = [
  {
    name: "WhatsApp",
    color: "bg-[#25D366] hover:bg-[#1EB855]",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    name: "Facebook",
    color: "bg-[#1877F2] hover:bg-[#166FE5]",
    icon: (
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    color: "bg-black hover:bg-neutral-800",
    icon: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export default function NovedadDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Load post + related
  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      if (!slug) return;
      try {
        setLoading(true);
        setError("");

        const { data, error: queryError } = await supabase
          .from("greenline_posts_public")
          .select("*")
          .eq("slug", slug)
          .single();

        if (queryError) throw new Error(queryError.message);

        if (!cancelled) {
          setPost(data);

          if (data) {
            const { data: related } = await supabase
              .from("greenline_posts_public")
              .select("*")
              .neq("id", data.id)
              .eq("category_slug", data.category_slug)
              .order("published_at", { ascending: false })
              .limit(3);

            if (!cancelled) {
              setRelatedPosts(
                (related ?? []).length >= 3
                  ? related!
                  : await getFallbackRelated(data, cancelled)
              );
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el artículo."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function getFallbackRelated(current: Post, cancelled: boolean): Promise<Post[]> {
      const { data } = await supabase
        .from("greenline_posts_public")
        .select("*")
        .neq("id", current.id)
        .order("published_at", { ascending: false })
        .limit(3);
      if (cancelled) return [];
      return data ?? [];
    }

    loadPost();
    return () => { cancelled = true; };
  }, [slug]);

  // Reading progress
  useEffect(() => {
    function handleScroll() {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      setReadProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
      setShowScrollTop(scrolled > 400);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close share dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft" && post?.gallery_images) setLightboxIndex((lightboxIndex - 1 + post.gallery_images.length) % post.gallery_images.length);
      if (e.key === "ArrowRight" && post?.gallery_images) setLightboxIndex((lightboxIndex + 1) % post.gallery_images.length);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, lightboxIndex, post]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentUrl]);

  const readingTime = useMemo(
    () => estimateReadingTime(post?.content_html ?? null, post?.content_text ?? null),
    [post]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-neutral-100" />
            <div className="h-10 w-4/5 rounded bg-neutral-100" />
            <div className="h-5 w-48 rounded bg-neutral-100" />
            <div className="aspect-[16/9] rounded-3xl bg-neutral-100" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 w-full rounded bg-neutral-100" style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Artículo no encontrado
          </h1>
          <p className="text-neutral-500 mb-6">
            {error || "El artículo que buscas no existe o fue removido."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Novedades
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = post.image_url;
  const imageAlt = cleanAlt(post.image_alt) ?? post.title;
  const hasContent = post.content_html || post.content_text;
  const excerptClean = cleanText(post.excerpt) || cleanText(post.content_text) || post.title;

  return (
    <main className="min-h-screen bg-white">
      <SEOHead
        title={post.title}
        description={
          excerptClean.length > 155
            ? excerptClean.slice(0, 155) + "…"
            : excerptClean
        }
        image={imageUrl || undefined}
        url={`/novedades/${post.slug}`}
        type="article"
        keywords={[post.category, 'movilidad eléctrica', 'Green Line']}
        jsonLd={[
          articleSchema(
            {
              title: post.title,
              excerpt: post.excerpt,
              image_url: imageUrl,
              published_at: post.published_at,
            },
            `/novedades/${post.slug}`,
          ),
          breadcrumbSchema([
            { name: 'Inicio', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/novedades/${post.slug}` },
          ]),
        ]}
      />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-100">
        <div
          className="h-full bg-brand transition-[width] duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero image */}
      {imageUrl && (
        <div className="relative h-[45vh] min-h-[300px] max-h-[540px] overflow-hidden bg-neutral-100">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      )}

      {/* Article wrapper */}
      <article className="mx-auto max-w-3xl px-6 -mt-20 relative z-10 pb-8">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition mb-6 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Novedades
        </Link>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-brand-dark">
            <Tag className="h-3 w-3" />
            {post.category}
          </span>
          {post.published_at && (
            <span className="inline-flex items-center gap-1 text-white/70">
              <Calendar className="h-3 w-3" />
              {formatDate(post.published_at)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-white/70">
            <Clock className="h-3 w-3" />
            {readingTime} min de lectura
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-neutral-950 mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {excerptClean && (
          <p className="text-lg text-neutral-500 leading-relaxed mb-8 border-l-4 border-brand pl-5">
            {excerptClean}
          </p>
        )}

        <TextToVoice texto={post.content_text} />

        {/* Share bar */}
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-neutral-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Compartir
          </span>

          <div className="relative" ref={shareRef}>
            <button
              type="button"
              onClick={() => setShareOpen(!shareOpen)}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>

            {shareOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-neutral-100 p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                {SHARE_BUTTONS.map((btn) => (
                  <a
                    key={btn.name}
                    href={btn.getUrl(currentUrl, post.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${btn.color}`}>
                      {btn.icon}
                    </span>
                    {btn.name}
                  </a>
                ))}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-600">
                    {copied ? <Check className="h-4 w-4 text-brand-dark" /> : <Copy className="h-4 w-4" />}
                  </span>
                  {copied ? "¡Copiado!" : "Copiar enlace"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef}>
          {hasContent ? (
            <div
              className="prose prose-neutral max-w-none
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-neutral-950
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-neutral-900
                [&_p]:text-base [&_p]:leading-[1.8] [&_p]:text-neutral-700 [&_p]:mb-5
                [&_img]:rounded-2xl [&_img]:w-full [&_img]:my-8 [&_img]:shadow-sm
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5
                [&_li]:text-neutral-700 [&_li]:mb-1.5 [&_li]:leading-relaxed
[&_a]:text-brand-dark [&_a]:underline [&_a]:decoration-brand-light [&_a]:hover:text-brand-dark [&_a]:decoration-2
        [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_blockquote]:my-6
                [&_strong]:text-neutral-900 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: post.content_html ?? "" }}
            />
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 p-10 text-center my-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-200">
                <Tag className="h-6 w-6 text-neutral-500" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Artículo en preparación
              </h3>
              <p className="text-sm text-neutral-500 mb-5 max-w-sm mx-auto">
                El contenido completo de este artículo está próximamente disponible.
              </p>
            </div>
          )}
        </div>

        {/* Gallery */}
        {post.gallery_images && post.gallery_images.length > 0 && (
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-950 mb-5">Galería de imágenes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {post.gallery_images.map((img, idx) => (
                <button
                  key={img.sort_order}
                  type="button"
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                >
                  <img
                    src={img.image_url}
                    alt={cleanAlt(img.image_alt) ?? post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Author + Share CTA card */}
        <div className="mt-12 rounded-2xl bg-neutral-950 p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-neutral-400 mb-1">Publicado por</p>
            <p className="text-lg font-bold text-white">Green Line Perú</p>
            <p className="text-sm text-neutral-500 mt-1">
              {post.published_at ? formatDate(post.published_at) : ""}
            </p>
          </div>

          <div className="flex gap-2">
            {SHARE_BUTTONS.map((btn) => (
              <a
                key={btn.name}
                href={btn.getUrl(currentUrl, post.title)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition ${btn.color}`}
                title={`Compartir en ${btn.name}`}
              >
                {btn.icon}
              </a>
            ))}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition hover:bg-neutral-700"
              title="Copiar enlace"
            >
              {copied ? <Check className="h-4 w-4 text-brand-light" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </article>

      {/* Suggested articles */}
      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 border-t border-neutral-100 mt-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">
                Sigue leyendo
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
                Artículos relacionados
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Ver todos
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((rp) => (
              <article key={rp.id} className="group">
                <Link
                  to={`/novedades/${rp.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100"
                >
                  <NovedadImagen
                    src={rp.image_url ?? null}
                    alt={cleanAlt(rp.image_alt) ?? rp.title}
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 backdrop-blur">
                    {rp.category}
                  </span>
                </Link>

                <div className="pt-4">
                  {rp.published_at && (
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
                      {formatDate(rp.published_at)}
                    </p>
                  )}
                  <Link to={`/novedades/${rp.slug}`}>
                    <h3 className="text-lg font-bold leading-snug text-neutral-950 transition group-hover:text-brand-dark line-clamp-2">
                      {rp.title}
                    </h3>
                  </Link>
                  {cleanText(rp.excerpt) && (
                    <p className="mt-2 text-sm leading-6 text-neutral-500 line-clamp-2">
                      {cleanText(rp.excerpt)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white"
            >
              Ver todos los artículos
              <span>→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-white shadow-lg transition hover:bg-neutral-800 hover:scale-105"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Lightbox */}
      {lightboxOpen && post.gallery_images && post.gallery_images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 z-10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {post.gallery_images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + post.gallery_images.length) % post.gallery_images.length); }}
                className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 z-10"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % post.gallery_images.length); }}
                className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 z-10"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={post.gallery_images[lightboxIndex].image_url}
              alt={cleanAlt(post.gallery_images[lightboxIndex].image_alt) ?? post.title}
              className="max-h-[80vh] w-auto mx-auto rounded-lg object-contain"
            />
            {(post.gallery_images[lightboxIndex].caption || post.gallery_images.length > 1) && (
              <div className="mt-3 text-center text-white/80 text-sm">
                {post.gallery_images[lightboxIndex].caption && (
                  <p className="mb-1">{post.gallery_images[lightboxIndex].caption}</p>
                )}
                {post.gallery_images.length > 1 && (
                  <p className="text-white/50">{lightboxIndex + 1} / {post.gallery_images.length}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
