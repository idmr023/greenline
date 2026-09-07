import { useState, useRef } from 'react';
import {
  GripVertical, ChevronUp, ChevronDown, Trash2, Plus, Type, Heading1,
  Heading2, List, ListOrdered, Quote, Image as ImageIcon,
  Minus, Upload, Move,
} from 'lucide-react';

const PREVIEW_CLASS = {
  p: 'text-base text-neutral-700 leading-relaxed mb-0',
  h1: 'text-2xl font-bold text-neutral-950',
  h2: 'text-xl font-bold text-neutral-950',
  h3: 'text-lg font-bold text-neutral-900',
  blockquote: 'border-l-4 border-brand pl-3 italic text-neutral-600',
  ul: 'list-disc pl-5 text-neutral-700',
  ol: 'list-decimal pl-5 text-neutral-700',
};

function emptyId() {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Convierte el HTML del artículo en bloques de nivel superior (drag & drop). */
function parseBlocks(html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  return Array.from(doc.body.childNodes)
    .filter((n) => !(n.nodeType === 3 && !n.textContent.trim()))
    .map((node, i) => {
      if (node.nodeType === 3) {
        return { id: emptyId() + i, tag: 'p', inner: node.textContent, src: '', alt: '' };
      }
      const tag = node.tagName.toLowerCase();
      if (tag === 'img') {
        return {
          id: emptyId() + i,
          tag: 'img',
          inner: '',
          src: node.getAttribute('src') || '',
          alt: node.getAttribute('alt') || '',
        };
      }
      if (tag === 'hr') return { id: emptyId() + i, tag: 'hr', inner: '', src: '', alt: '' };
      return { id: emptyId() + i, tag, inner: node.innerHTML, src: '', alt: '' };
    });
}

function buildHtml(block) {
  if (block.tag === 'hr') return '<hr>';
  if (block.tag === 'img') return `<img src="${block.src || ''}" alt="${block.alt || ''}">`;
  return `<${block.tag}>${block.inner || ''}</${block.tag}>`;
}

export default function BlockEditor({ value, onChange, onUpload }) {
  const [blocks, setBlocks] = useState(() => parseBlocks(value));
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const fileInputRef = useRef(null);
  const imgTargetRef = useRef(null);

  const commit = (next) => {
    setBlocks(next);
    onChange(next.map(buildHtml).join(''));
  };

  const updateBlock = (id, patch) => {
    commit(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const moveBlock = (from, to) => {
    if (to < 0 || to >= blocks.length || from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };

  const removeBlock = (id) => commit(blocks.filter((b) => b.id !== id));

  const addBlock = (tag) => {
    const base = { id: emptyId(), tag, inner: '', src: '', alt: '' };
    if (tag === 'img') commit([...blocks, base]);
    else if (tag === 'hr') commit([...blocks, base]);
    else if (tag === 'ul' || tag === 'ol') commit([...blocks, { ...base, inner: '<li>Elemento</li>' }]);
    else commit([...blocks, { ...base, inner: '<br>' }]);
  };

  const askUpload = (blockId) => {
    imgTargetRef.current = blockId;
    fileInputRef.current?.click();
  };

  const handleFile = async (file) => {
    const targetId = imgTargetRef.current;
    imgTargetRef.current = null;
    if (!file || !onUpload || !targetId) return;
    setSubiendo(true);
    try {
      const url = await onUpload(file);
      if (url) updateBlock(targetId, { src: url, alt: '' });
    } finally {
      setSubiendo(false);
    }
  };

  const renderContent = (block) => {
    if (block.tag === 'img') {
      return (
        <div className="flex-1 space-y-2">
          {block.src ? (
            <div className="flex items-start justify-center rounded-lg border border-gray-200 bg-gray-50 p-2">
              <img src={block.src} alt={block.alt || ''} className="max-h-56 w-auto rounded object-contain" />
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">
              Sin imagen
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              value={block.src}
              onChange={(e) => updateBlock(block.id, { src: e.target.value })}
              className="input flex-1 text-xs"
              placeholder="https://... (URL de la imagen)"
            />
            <button
              type="button"
              onClick={() => askUpload(block.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
              title="Subir imagen"
            >
              <Upload className="h-3.5 w-3.5" />
              {subiendo ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
          <input
            value={block.alt || ''}
            onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
            className="input text-xs"
            placeholder="Texto alternativo (alt)"
          />
        </div>
      );
    }

    if (block.tag === 'hr') {
      return (
        <div className="flex flex-1 items-center py-3">
          <span className="mx-3 text-xs font-medium uppercase tracking-wider text-gray-400">Separador</span>
          <div className="flex-1 border-t-2 border-gray-200" />
        </div>
      );
    }

    const isList = block.tag === 'ul' || block.tag === 'ol';
    const previewClass = PREVIEW_CLASS[block.tag] || PREVIEW_CLASS.p;

    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const el = e.currentTarget;
          const inner = isList ? el.querySelector(block.tag)?.innerHTML || '' : el.innerHTML;
          updateBlock(block.id, { inner });
        }}
        className={`min-h-[2.5rem] flex-1 focus:outline-none ${previewClass}`}
        data-placeholder="Escribe..."
        dangerouslySetInnerHTML={{
          __html: isList ? `<${block.tag}>${block.inner}</${block.tag}>` : block.inner || '<br>',
        }}
      />
    );
  };

  const addButtons = [
    { tag: 'p', label: 'Párrafo', icon: Type },
    { tag: 'h2', label: 'Título', icon: Heading1 },
    { tag: 'h3', label: 'Subtítulo', icon: Heading2 },
    { tag: 'blockquote', label: 'Cita', icon: Quote },
    { tag: 'ul', label: 'Lista', icon: List },
    { tag: 'ol', label: 'Numerada', icon: ListOrdered },
    { tag: 'img', label: 'Imagen', icon: ImageIcon },
    { tag: 'hr', label: 'Divisor', icon: Minus },
  ];

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <div className="space-y-2">
        {blocks.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-400">
            Aún no hay contenido. Añade tu primer bloque abajo.
          </p>
        )}

        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => {
              setDragIndex(index);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex != null && dragIndex !== index) moveBlock(dragIndex, index);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`flex items-start gap-2 rounded-lg border bg-white p-2 transition-colors ${
              overIndex === index && dragIndex !== null && dragIndex !== index
                ? 'border-brand ring-2 ring-brand/30'
                : 'border-gray-200 hover:border-brand/40'
            }`}
          >
            <div className="flex w-7 shrink-0 flex-col items-center gap-0.5 pt-1">
              <span className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing" title="Arrastrar para mover">
                <GripVertical className="h-4 w-4" />
              </span>
              <button
                type="button"
                onClick={() => moveBlock(index, index - 1)}
                disabled={index === 0}
                className="p-0.5 text-gray-300 hover:text-brand disabled:opacity-30"
                title="Mover arriba"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, index + 1)}
                disabled={index === blocks.length - 1}
                className="p-0.5 text-gray-300 hover:text-brand disabled:opacity-30"
                title="Mover abajo"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(block.id)}
                className="mt-1 p-0.5 text-gray-300 hover:text-red-500"
                title="Eliminar bloque"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {renderContent(block)}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500">
          <Plus className="h-3.5 w-3.5" />
          Añadir bloque:
        </span>
        {addButtons.map(({ tag, label, icon: Icon }) => (
          <button
            key={tag}
            type="button"
            onClick={() => addBlock(tag)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:border-brand hover:text-brand transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
        <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-gray-400">
          <Move className="h-3 w-3" />
          Arrastra con el asa para reordenar.
        </span>
      </div>
    </div>
  );
}