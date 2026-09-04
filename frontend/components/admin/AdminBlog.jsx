import { useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '../../lib/supabase';
import {
  Plus, Pencil, Trash2, ArrowLeft, Save, Upload, FileText,
  Eye, EyeOff, GripVertical, X, AlertTriangle, Image as ImageIcon,
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Minus, Undo, Redo,
} from 'lucide-react';

const EMPTY = {
  title: '',
  slug: '',
  category_id: '',
  excerpt: '',
  content_html: '',
  image_url: '',
  image_alt: '',
  published_at: '',
  featured: false,
  active: true,
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-amber-600'}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand hover:bg-brand-dark'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
    >
      {children}
    </button>
  );
}

function GalleryManager({ _postId, images, onImagesChange, uploadingGallery, setUploadingGallery }) {
  const handleUploadGallery = async (files) => {
    if (!files || !files.length) return;
    setUploadingGallery(true);
    const newImages = [];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      alert('Sesión no válida. Inicia sesión de nuevo.');
      setUploadingGallery(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${apiUrl}/blog/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          alert('Error subiendo imagen: ' + (data.error || res.statusText));
          continue;
        }
        newImages.push({ image_url: data.url, image_alt: '', sort_order: images.length + newImages.length });
      } catch (err) {
        alert('Error de conexión: ' + err.message);
      }
    }
    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
    setUploadingGallery(false);
  };

  const removeImage = (idx) => {
    onImagesChange(images.filter((_, i) => i !== idx));
  };

  const updateAlt = (idx, alt) => {
    const updated = [...images];
    updated[idx] = { ...updated[idx], image_alt: alt };
    onImagesChange(updated);
  };

  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onImagesChange(updated.map((img, i) => ({ ...img, sort_order: i })));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <ImageIcon className="w-4 h-4" />
          Agregar imágenes
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUploadGallery(e.target.files)}
          />
        </label>
        {uploadingGallery && <p className="text-xs text-brand">Subiendo...</p>}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group border border-gray-200 rounded-lg overflow-hidden">
              <img src={img.image_url} alt={img.image_alt || ''} className="w-full h-28 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(idx, idx - 1)}
                  className="p-1 bg-white/90 rounded text-gray-700 hover:bg-white text-xs"
                  title="Mover izquierda"
                >
                  <GripVertical className="w-3 h-3 rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(idx, idx + 1)}
                  className="p-1 bg-white/90 rounded text-gray-700 hover:bg-white text-xs"
                  title="Mover derecha"
                >
                  <GripVertical className="w-3 h-3 -rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1 bg-red-500/90 rounded text-white hover:bg-red-600 text-xs"
                  title="Eliminar"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <input
                value={img.image_alt || ''}
                onChange={(e) => updateAlt(idx, e.target.value)}
                className="w-full text-xs px-2 py-1 border-t border-gray-100 focus:outline-none"
                placeholder="Texto alternativo"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: 'Escribe el contenido del artículo aquí...' }),
    ],
    content: form.content_html || '',
    onUpdate: ({ editor: e }) => {
      setForm((f) => ({ ...f, content_html: e.getHTML() }));
    },
  });

  const categoryById = useMemo(() => {
    const map = {};
    for (const cat of categories) map[cat.id] = cat;
    return map;
  }, [categories]);

  useEffect(() => {
    loadMeta();
    loadPosts();
  }, []);

  useEffect(() => {
    if (editor && !editingId) {
      editor.commands.setContent(form.content_html || '');
    }
  }, [form.content_html, editor, editingId]);

  async function loadMeta() {
    const { data } = await supabase
      .from('greenline_categories')
      .select('*')
      .order('sort_order')
      .order('name');
    setCategories(data || []);
  }

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('greenline_posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (error) {
      alert('Error cargando artículos: ' + error.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }

  async function loadGallery(postId) {
    if (!postId) { setGalleryImages([]); return; }
    const { data } = await supabase
      .from('greenline_post_images')
      .select('*')
      .eq('post_id', postId)
      .order('sort_order');
    setGalleryImages(data || []);
  }

  const startNew = () => {
    setEditingId(null);
    setGalleryImages([]);
    setForm({
      ...EMPTY,
      category_id: categories[0]?.id || '',
      published_at: new Date().toISOString().slice(0, 10),
      title: '',
      slug: '',
    });
    if (editor) editor.commands.setContent('');
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      category_id: post.category_id || '',
      excerpt: post.excerpt || '',
      content_html: post.content_html || '',
      image_url: post.image_url || '',
      image_alt: post.image_alt || '',
      published_at: (post.published_at || '').slice(0, 10),
      featured: post.featured,
      active: post.active,
    });
    if (editor) editor.commands.setContent(post.content_html || '');
    loadGallery(post.id);
  };

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY);
    setGalleryImages([]);
    if (editor) editor.commands.setContent('');
  };

  const onTitleChange = (val) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: editingId ? f.slug : slugify(val),
    }));
  };

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('Sesión no válida. Inicia sesión de nuevo.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/blog/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert('Error subiendo imagen: ' + (data.error || res.statusText));
        setUploading(false);
        return;
      }

      setField('image_url', data.url);
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }
    setUploading(false);
  };

  const handleDelete = async (post) => {
    setConfirmAction({ type: 'delete', post });
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    const post = confirmAction.post;
    setConfirmOpen(false);
    const { error } = await supabase
      .from('greenline_post_images')
      .delete()
      .eq('post_id', post.id);
    if (error) {
      alert('Error limpiando imágenes del artículo: ' + error.message);
      return;
    }
    const { error: delErr } = await supabase
      .from('greenline_posts')
      .delete()
      .eq('id', post.id);
    if (delErr) {
      alert('Error eliminando artículo: ' + delErr.message);
      return;
    }
    loadPosts();
  };

  const requestSave = () => {
    if (!form.title.trim() || !editor?.getHTML().trim()) {
      alert('Título y contenido son obligatorios');
      return;
    }
    if (!form.category_id) {
      alert('Selecciona una categoría');
      return;
    }
    setConfirmAction({ type: 'save' });
    setConfirmOpen(true);
  };

  const executeSave = async () => {
    setConfirmOpen(false);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      category_id: form.category_id,
      excerpt: form.excerpt || null,
      content_html: editor?.getHTML() || form.content_html,
      content_text: form.excerpt || (editor?.getText() || ''),
      image_url: form.image_url || null,
      image_alt: form.image_alt || null,
      published_at: form.published_at || new Date().toISOString().slice(0, 10),
      featured: form.featured,
      active: form.active !== false,
    };

    const { data: savedPost, error } = editingId
      ? await supabase.from('greenline_posts').update(payload).eq('id', editingId).select('id')
      : await supabase.from('greenline_posts').insert({
          ...payload,
          author: 'A. Yeren',
          sort_order: 0,
        }).select('id');

    if (error) {
      setSaving(false);
      alert('Error guardando artículo: ' + (error.message.includes('duplicate') ? 'Ya existe un artículo con ese slug' : error.message));
      return;
    }

    const postId = editingId || savedPost?.[0]?.id;
    if (postId && galleryImages.length > 0) {
      await supabase.from('greenline_post_images').delete().eq('post_id', postId);
      const inserts = galleryImages.map((img, i) => ({
        post_id: postId,
        image_url: img.image_url,
        image_alt: img.image_alt || null,
        sort_order: i,
      }));
      await supabase.from('greenline_post_images').insert(inserts);
    }

    setSaving(false);
    cancel();
    loadPosts();
  };

  const getConfirmTitle = () => {
    if (confirmAction?.type === 'delete') return 'Eliminar artículo';
    if (confirmAction?.type === 'save') {
      return form.active
        ? (editingId ? 'Actualizar y publicar' : 'Publicar artículo')
        : (editingId ? 'Actualizar borrador' : 'Guardar borrador');
    }
    return 'Confirmar';
  };

  const getConfirmMessage = () => {
    if (confirmAction?.type === 'delete') {
      return `¿Eliminar el artículo "${confirmAction.post.title}"? Se borrará definitivamente.`;
    }
    if (confirmAction?.type === 'save') {
      return form.active
        ? (editingId ? '¿Actualizar y publicar este artículo?' : '¿Publicar este artículo?')
        : (editingId ? '¿Actualizar este borrador?' : '¿Guardar este artículo como borrador?');
    }
    return '';
  };

  const getConfirmLabel = () => {
    if (confirmAction?.type === 'delete') return 'Eliminar';
    if (confirmAction?.type === 'save') {
      return form.active
        ? (editingId ? 'Actualizar y publicar' : 'Publicar')
        : (editingId ? 'Actualizar' : 'Guardar borrador');
    }
    return '';
  };

  const handleConfirm = () => {
    if (confirmAction?.type === 'delete') return executeDelete();
    if (confirmAction?.type === 'save') return executeSave();
  };

  if (!editingId && form === EMPTY) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
            <p className="text-sm text-gray-500 mt-1">Gestiona los artículos de Novedades</p>
          </div>
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo artículo
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay artículos.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-300 shrink-0" />
                        {post.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{categoryById[post.category_id]?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{post.published_at || '—'}</td>
                    <td className="px-4 py-3">
                      {post.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
                          <Eye className="w-3 h-3" /> Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                          <EyeOff className="w-3 h-3" /> Borrador
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(post)}
                          className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmModal
          open={confirmOpen}
          title={getConfirmTitle()}
          message={getConfirmMessage()}
          confirmLabel={getConfirmLabel()}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
          danger={confirmAction?.type === 'delete'}
        />
      </div>
    );
  }

  if (!categories.length && loading) {
    return <div className="p-8 text-sm text-gray-400">Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={cancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Editar artículo' : 'Nuevo artículo'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Publicado en la página de Novedades</p>
          </div>
        </div>
        <button
          onClick={requestSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Datos generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título *">
            <input value={form.title} onChange={(e) => onTitleChange(e.target.value)} className="input" />
          </Field>
          <Field label="Slug (URL)">
            <input value={form.slug} readOnly className="input bg-gray-50 cursor-not-allowed" />
          </Field>
          <Field label="Categoría *">
            <div className="flex gap-2">
              <select value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} className="input flex-1">
                <option value="">Seleccionar...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const name = prompt('Nombre de la nueva categoría:');
                  if (name && name.trim()) {
                    setNewCategoryName(name.trim());
                    setTimeout(() => {
                      const slug = slugify(name.trim());
                      const sort = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order || 0)) + 1 : 0;
                      supabase.from('greenline_categories')
                        .insert({ name: name.trim(), slug, sort_order: sort })
                        .select()
                        .single()
                        .then(({ data, error }) => {
                          if (error) { alert('Error: ' + error.message); return; }
                          setCategories((prev) => [...prev, data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
                          setForm((f) => ({ ...f, category_id: data.id }));
                        });
                    }, 0);
                  }
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
                title="Nueva categoría"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </Field>
          <Field label="Fecha de publicación">
            <input
              type="date"
              value={form.published_at}
              readOnly
              className="input bg-gray-50 cursor-not-allowed"
            />
          </Field>
          <Field label="Descripción / Extracto" full>
            <textarea rows={2} value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} className="input" />
          </Field>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField('featured', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setField('active', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              Publicado
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Contenido</h2>
        {editor && (
          <>
            <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-200 rounded-t-lg bg-gray-50">
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título 1">
                <Heading1 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">
                <Quote className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Línea horizontal">
                <Minus className="w-4 h-4" />
              </ToolbarButton>
              <div className="flex-1" />
              <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
                <Undo className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>
            <div className="border border-t-0 border-gray-200 rounded-b-lg min-h-[300px] max-h-[500px] overflow-y-auto">
              <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0" />
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Imagen de portada</h2>
        <div className="flex items-start gap-4">
          {form.image_url && (
            <img src={form.image_url} alt="" className="w-40 h-28 object-cover rounded-lg border border-gray-200" />
          )}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
              </label>
              {uploading && <p className="text-xs text-brand">Subiendo...</p>}
            </div>
            <input
              value={form.image_url}
              onChange={(e) => setField('image_url', e.target.value)}
              className="input text-xs"
              placeholder="https://... (URL de la imagen)"
            />
            <input
              value={form.image_alt}
              onChange={(e) => setField('image_alt', e.target.value)}
              className="input text-xs"
              placeholder="Texto alternativo (alt)"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Galería de imágenes</h2>
        <GalleryManager
          postId={editingId}
          images={galleryImages}
          onImagesChange={setGalleryImages}
          uploadingGallery={uploadingGallery}
          setUploadingGallery={setUploadingGallery}
        />
      </div>

      <div className="flex justify-end mt-8 pb-8">
        <button
          onClick={requestSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar Artículo'}
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={getConfirmTitle()}
        message={getConfirmMessage()}
        confirmLabel={getConfirmLabel()}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        danger={confirmAction?.type === 'delete'}
      />
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
