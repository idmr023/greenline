import { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, Download, Loader2 } from '../lib/icons';

// Configurar worker de PDF.js usando CDN compatible con la versión 3.11.174
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfFlipViewer({ fileUrl, title: _title }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitScale, setFitScale] = useState(0);
  const scale = fitScale * zoomLevel;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const canvasRefRight = useRef(null); // Para vista doble tipo revista
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null); // Render actual en vuelo (para cancelar en navegación rápida)

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    const computeFit = async () => {
      try {
        const page = await pdfDoc.getPage(1);
        const vp = page.getViewport({ scale: 1 });
        const box = containerRef.current?.getBoundingClientRect();
        if (!box) return;
        const WRAP_PADDING = 32; // p-4 del contenedor tipo revista (16px por lado)
        const gap = isDesktop ? 16 : 0; // gap-4 entre las dos páginas
        const spreadW = isDesktop ? vp.width * 2 + gap : vp.width;
        const availW = Math.max(1, box.width - 48 - WRAP_PADDING);
        const availH = Math.max(1, box.height - 48 - WRAP_PADDING);
        if (!cancelled) setFitScale(Math.max(0.05, Math.min(availW / spreadW, availH / vp.height)));
      } catch (e) {}
    };
    computeFit();
    return () => { cancelled = true; };
  }, [pdfDoc, isDesktop]);

  const renderPage = useCallback(async (num, numRight = null) => {
    if (!pdfDoc || !scale) return;
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch {}
      renderTaskRef.current = null;
    }
    try {
      const page = await pdfDoc.getPage(num);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const renderTask = page.render({
        canvasContext: context,
        viewport: viewport,
      });
      renderTaskRef.current = renderTask;
      await renderTask.promise;

      // Si hay página derecha (vista doble)
      if (numRight && canvasRefRight.current) {
        try {
          const pageRight = await pdfDoc.getPage(numRight);
          const canvasR = canvasRefRight.current;
          const contextR = canvasR.getContext('2d');
          const viewportR = pageRight.getViewport({ scale });

          canvasR.height = viewportR.height;
          canvasR.width = viewportR.width;
          canvasR.style.width = `${viewportR.width}px`;
          canvasR.style.height = `${viewportR.height}px`;

          const renderTaskR = pageRight.render({
            canvasContext: contextR,
            viewport: viewportR,
          });
          renderTaskRef.current = renderTaskR;
          await renderTaskR.promise;
        } catch {
          const canvasR = canvasRefRight.current;
          if (canvasR) {
            const ctxR = canvasR.getContext('2d');
            ctxR.clearRect(0, 0, canvasR.width, canvasR.height);
          }
        }
      } else if (canvasRefRight.current) {
        const canvasR = canvasRefRight.current;
        const ctxR = canvasR.getContext('2d');
        ctxR.clearRect(0, 0, canvasR.width, canvasR.height);
      }
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Error renderizando página PDF:', err);
      }
    }
  }, [pdfDoc, scale]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    pdfjsLib.getDocument(fileUrl).promise.then(
      (doc) => {
        if (!active) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
        setLoading(false);
      },
      (err) => {
        if (!active) return;
        console.error('Error cargando documento PDF:', err);
        setError('No se pudo cargar el documento PDF.');
        setLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, [fileUrl]);

  useEffect(() => {
    if (pdfDoc) {
      const leftPage = pageNum;
      const rightPage = isDesktop && pageNum + 1 <= numPages ? pageNum + 1 : null;
      renderPage(leftPage, rightPage);
    }
  }, [pdfDoc, pageNum, scale, numPages, isDesktop, renderPage]);

  const goToPrevPage = () => {
    const step = isDesktop ? 2 : 1;
    setPageNum((prev) => Math.max(1, prev - step));
  };

  const goToNextPage = () => {
    const step = isDesktop ? 2 : 1;
    setPageNum((prev) => Math.min(numPages, prev + step));
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(5, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoomLevel((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const zoomReset = () => setZoomLevel(1);

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-xl overflow-hidden shadow-inner">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 text-white border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-brand/20 text-brand-light rounded-md">
            Pág. {pageNum} {isDesktop && pageNum + 1 <= numPages ? `- ${pageNum + 1}` : ''} de {numPages}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Alejar zoom"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span className="text-xs text-neutral-400 font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button
            type="button"
            onClick={zoomReset}
            className="px-1.5 py-0.5 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
            title="Zoom real"
          >
            Ajustar
          </button>
          <button
            type="button"
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Acercar zoom"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          <a
            href={fileUrl}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar PDF
          </a>
        </div>
      </div>

      {/* Visor / Lienzo de páginas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative bg-neutral-900 min-h-[450px]" ref={containerRef}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 text-neutral-300 gap-3 z-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p className="text-sm font-medium">Cargando documento interactivo...</p>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center p-6 bg-red-950/30 rounded-xl border border-red-900/50">
            {error}
          </div>
        )}

        {/* Contenedor tipo libro / revista abierto */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 shadow-2xl bg-neutral-950 p-4 rounded-xl border border-neutral-800">
          <div className="relative shadow-lg overflow-hidden rounded bg-white">
            <canvas ref={canvasRef} className="block" />
          </div>
          {isDesktop && (
            <div className="relative shadow-lg overflow-hidden rounded bg-white">
              <canvas ref={canvasRefRight} className="block" />
            </div>
          )}
        </div>
      </div>

      {/* Controles de navegación inferiores */}
      <div className="flex items-center justify-between px-6 py-3 bg-neutral-950 text-white border-t border-neutral-800 shrink-0">
        <button
          type="button"
          onClick={goToPrevPage}
          disabled={pageNum <= 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-sm font-semibold text-neutral-200 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="text-xs text-neutral-400">
          Usa los botones para navegar por las páginas
        </div>

        <button
          type="button"
          onClick={goToNextPage}
          disabled={pageNum >= numPages}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 text-sm font-semibold text-neutral-200 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
