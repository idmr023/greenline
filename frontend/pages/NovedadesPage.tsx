import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import NovedadImagen from "../components/NovedadImagen";
import PageBanner from "../components/PageBanner";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Post = {
  id: string;
  wordpress_post_id: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string | null;
  content_text: string | null;
  image_url: string | null;
  image_alt: string | null;
  original_url: string | null;
  published_at: string | null;
  featured: boolean;
  active: boolean;
  category_id: string;
  category: string;
  category_slug: string;
  source_category: string | null;
  source_tags: string[];
};

function cleanText(value: string | null): string | null {
  if (!value) return null;
  const cleaned = value.replace(/\t/g, " ").replace(/\s+/g, " ").trim();
  return cleaned || null;
}

function cleanAlt(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "[]" || trimmed === "{}" || trimmed === "") return null;
  return trimmed;
}

export default function NovedadesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const { data, error: queryError } = await supabase
          .from("greenline_posts_public")
          .select("*")
          .order("published_at", { ascending: false });

        if (queryError) {
          throw new Error(queryError.message);
        }

        if (!cancelled) {
          setPosts(data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Ocurrió un error al cargar las novedades."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, Category>();

    posts.forEach((post) => {
      if (!map.has(post.category_id)) {
        map.set(post.category_id, {
          id: post.category_id,
          name: post.category,
          slug: post.category_slug,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "todos" ||
        post.category_slug === activeCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      return (
        post.title.toLowerCase().includes(query) ||
        cleanText(post.excerpt)?.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.source_tags.some((tag) =>
          tag.toLowerCase().includes(query)
        )
      );
    });
  }, [posts, activeCategory, search]);

  const featuredPost = useMemo(() => {
    if (activeCategory === "todos" && !search.trim()) {
      return (
        posts.find((post) => post.featured) ??
        [...posts]
          .filter((post) => post.published_at)
          .sort((a, b) =>
            (b.published_at ?? "").localeCompare(a.published_at ?? "")
          )[0]
      );
    }

    return filteredPosts[0];
  }, [posts, filteredPosts, activeCategory, search]);

  const remainingPosts = useMemo(() => {
    if (!featuredPost) return [];
    return filteredPosts.filter((post) => post.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  function formatDate(date: string | null) {
    if (!date) return "";
    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  function getArticleUrl(post: Post) {
    return `/novedades/${post.slug}`;
  }

  function getImage(post: Post) {
    return post.image_url ?? null;
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">

      <PageBanner 
        title="Novedades" 
        subtitle="Noticias, consejos y contenido sobre movilidad eléctrica." 
      />

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* FILTROS */}
        <div className="mb-12 flex flex-col gap-5 border-b border-neutral-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("todos")}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                activeCategory === "todos"
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Todos
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  activeCategory === category.slug
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-5 text-sm outline-none transition focus:border-neutral-950"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-neutral-100"
              >
                <div className="aspect-[16/10] animate-pulse bg-neutral-100" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* SIN RESULTADOS */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="rounded-3xl bg-neutral-50 px-6 py-20 text-center">
            <h2 className="text-xl font-semibold">
              No encontramos novedades
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Prueba con otra categoría o modifica tu búsqueda.
            </p>
          </div>
        )}

        {/* DESTACADO */}
        {!loading && !error && featuredPost && (
          <article className="group mb-14 grid overflow-hidden rounded-[2rem] bg-neutral-950 lg:grid-cols-2">
            <a
              href={getArticleUrl(featuredPost)}
              className="relative block min-h-[320px] overflow-hidden lg:min-h-[520px]"
            >
              <NovedadImagen
                src={getImage(featuredPost)}
                alt={cleanAlt(featuredPost.image_alt) ?? featuredPost.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <span className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-950">
                Destacado
              </span>
            </a>

            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
                <span className="text-brand-light">
                  {featuredPost.category}
                </span>

                {featuredPost.published_at && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-neutral-600" />
                    <span className="text-neutral-500">
                      {formatDate(featuredPost.published_at)}
                    </span>
                  </>
                )}
              </div>

              <a href={getArticleUrl(featuredPost)}>
                <h2 className="mt-5 text-3xl font-semibold leading-tight text-white transition hover:text-brand-light sm:text-4xl">
                  {featuredPost.title}
                </h2>
              </a>

              {cleanText(featuredPost.excerpt) && (
                <p className="mt-5 line-clamp-4 text-base leading-7 text-neutral-400">
                  {cleanText(featuredPost.excerpt)}
                </p>
              )}

              <a
                href={getArticleUrl(featuredPost)}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand-light px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-brand"
              >
                Leer artículo
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        )}

        {/* GRID */}
        {!loading && !error && remainingPosts.length > 0 && (
          <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => (
              <article key={post.id} className="group">
                <a
                  href={getArticleUrl(post)}
                  className="relative block aspect-[16/10] overflow-hidden rounded-3xl bg-neutral-100"
                >
                  <NovedadImagen
                    src={getImage(post)}
                    alt={cleanAlt(post.image_alt) ?? post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 backdrop-blur">
                    {post.category}
                  </span>
                </a>

                <div className="pt-5">
                  {post.published_at && (
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                      {formatDate(post.published_at)}
                    </p>
                  )}

                  <a href={getArticleUrl(post)}>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-neutral-950 transition group-hover:text-brand-dark">
                      {post.title}
                    </h3>
                  </a>

                  {cleanText(post.excerpt) && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
                      {cleanText(post.excerpt)}
                    </p>
                  )}

                  <a
                    href={getArticleUrl(post)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 transition hover:text-brand-dark"
                  >
                    Leer más
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
