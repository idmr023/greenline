import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Bold, Italic, Heading2, Heading3, Image as ImageIcon,
  Table as TableIcon, LayoutGrid, Eye, Save, X, AlertTriangle, Upload,
} from 'lucide-react';

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NuevoArticuloPage() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [autor, setAutor] = useState('GreenLine Editorial');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [contenido, setContenido] = useState('<p>Escribe tu artículo aquí...</p>');
  const [imagenPortada, setImagenPortada] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    supabase
      .from('blog_categorias')
      .select('id, nombre')
      .then(({ data }) => {
        if (data) setCategorias(data);
      });
  }, []);

  const handleTituloChange = (e) => {
    const val = e.target.value;
    setTitulo(val);
    setSlug(slugify(val));
  };

  const handleInsertTag = (openTag, closeTag) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.substring(start, end);
    const replacement = `${openTag}${selected || 'texto'}${closeTag}`;
    const next = text.substring(0, start) + replacement + text.substring(end);
    setContenido(next);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 0);
  };

  const handleInsertLayout = (columns) => {
    let snippet = '';
    if (columns === '2') {
      snippet = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4"><div class="p-4 bg-gray-50 rounded-xl">Columna 1</div><div class="p-4 bg-gray-50 rounded-xl">Columna 2</div></div>';
    } else {
      snippet = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4"><div class="p-4 bg-gray-50 rounded-xl">Col 1</div><div class="p-4 bg-gray-50 rounded-xl">Col 2</div><div class="p-4 bg-gray-50 rounded-xl">Col 3</div></div>';
    }
    setContenido((prev) => prev + '\n' + snippet);
  };

  const handleInsertTable = () => {
    const tableHtml = '<table class="w-full border-collapse border border-gray-300 my-4"><thead><tr class="bg-gray-100"><th class="border border-gray-300 p-2">Cabecera 1</th><th class="border border-gray-300 p-2">Cabecera 2</th></tr></thead><tbody><tr><td class="border border-gray-300 p-2">Dato 1</td><td class="border border-gray-300 p-2">Dato 2</td></tr></tbody></table>';
    setContenido((prev) => prev + '\n' + tableHtml);
  };

  const handleUploadImageFile = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('Sesión no válida.');
        setUploadingImage(false);
        return;
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${apiUrl}/blog/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error subiendo');

      setContenido((prev) => prev + `\n<div class="my-4"><img src="${data.url}" alt="${file.name}" class="rounded-xl w-full object-cover shadow-sm"/></div>`);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      alert('El título es obligatorio.');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = {
        title: titulo.trim(),
        slug: slug.trim() || slugify(titulo),
        author: autor.trim(),
        category_id: categoriaId ? Number(categoriaId) : null,
        content_html: contenido,
        image_url: imagenPortada || null,
        excerpt: contenido.replace(/<[^>]*>/g, '').slice(0, 160),
        active: true,
      };

      const { error } = await supabase.from('blog_posts').insert([payload]);
      if (error) throw error;

      alert('¡Artículo guardado con éxito!');
      navigate('/admin?view=blog');
    } catch (err) {
      alert('Error al guardar artículo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Barra superior de navegación / acciones */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin?view=blog')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            title="Volver al panel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Nuevo Artículo de Blog</h1>
            <p className="text-xs text-gray-500">Crea y edita publicaciones para la comunidad GreenLine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4 text-gray-500" />
            Vista Previa
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Artículo'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Formulario de campos básicos */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Información Básica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Título del Artículo</label>
              <input
                type="text"
                value={titulo}
                onChange={handleTituloChange}
                placeholder="Ej. Movilidad sostenible en Lima 2026..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Slug (URL amigable)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="movilidad-sostenible-lima-2026"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm font-mono text-gray-600 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Autor</label>
              <input
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="GreenLine Editorial"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm bg-white text-gray-900"
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">URL Imagen de Portada</label>
              <input
                type="text"
                value={imagenPortada}
                onChange={(e) => setImagenPortada(e.target.value)}
                placeholder="https://... o ruta de imagen"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm text-gray-900"
              />
            </div>
          </div>
        </section>

        {/* Barra de Herramientas Sticky con temática #009000 */}
        <div className="sticky top-20 z-20 mb-4 bg-[#009000] rounded-2xl shadow-md p-2 flex flex-wrap items-center gap-2 text-white">
          <button
            type="button"
            onClick={() => handleInsertTag('<strong>', '</strong>')}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Negrita"
          >
            <Bold className="w-4 h-4" /> Negrita
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('<em>', '</em>')}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Cursiva"
          >
            <Italic className="w-4 h-4" /> Cursiva
          </button>
          <div className="w-px h-6 bg-white/30 mx-1" />
          <button
            type="button"
            onClick={() => handleInsertTag('<h2>', '</h2>')}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Encabezado H2"
          >
            <Heading2 className="w-4 h-4" /> H2
          </button>
          <button
            type="button"
            onClick={() => handleInsertTag('<h3>', '</h3>')}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Encabezado H3"
          >
            <Heading3 className="w-4 h-4" /> H3
          </button>
          <div className="w-px h-6 bg-white/30 mx-1" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Insertar Imagen"
          >
            <ImageIcon className="w-4 h-4" /> {uploadingImage ? 'Subiendo...' : 'Imagen'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleUploadImageFile(e.target.files?.[0])}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleInsertTable}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Insertar Tabla"
          >
            <TableIcon className="w-4 h-4" /> Tabla
          </button>
          <div className="w-px h-6 bg-white/30 mx-1" />
          <button
            type="button"
            onClick={() => handleInsertLayout('2')}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Layout 2 columnas"
          >
            <LayoutGrid className="w-4 h-4" /> 2 Columnas
          </button>
          <button
            type="button"
            onClick={() => handleInsertLayout('3')}
            className="p-2 rounded-lg hover:bg-white/25 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Layout 3 columnas"
          >
            <LayoutGrid className="w-4 h-4" /> 3 Columnas
          </button>
        </div>

        {/* Área de escritura "Hoja de papel" (Google Docs style) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-[800px] mx-auto p-8 sm:p-12 min-h-[550px] flex flex-col">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-2xl font-extrabold text-gray-900">{titulo || 'Sin título aún'}</h3>
            <p className="text-xs text-gray-400 mt-1">Por {autor || 'GreenLine Editorial'} • Slug: {slug || 'slug-del-articulo'}</p>
          </div>
          <textarea
            ref={textareaRef}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full flex-1 resize-none focus:outline-none text-gray-800 leading-relaxed font-sans text-base min-h-[400px]"
            placeholder="Escribe el contenido HTML o texto de tu artículo aquí..."
          />
        </div>
      </main>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-brand px-3 py-1 bg-brand/10 rounded-full">
              Vista Previa
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">{titulo || 'Artículo sin título'}</h1>
            <p className="text-sm text-gray-500 mb-6">Por {autor} • Publicado recientemente</p>
            {imagenPortada && (
              <img src={imagenPortada} alt="Portada" className="w-full h-64 object-cover rounded-xl mb-6 shadow-md" />
            )}
            <div
              className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: contenido }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
