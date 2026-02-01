'use client';

import { useEffect } from 'react';

export function PdfPreviewModal({
  open,
  url,
  title,
  onClose,
}: {
  open: boolean;
  url: string | null;
  title?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !url) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Kapat"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[min(980px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900">{title || 'PDF Önizleme'}</div>
            <div className="truncate text-xs text-slate-500">{url}</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-soft-gray"
            >
              Yeni sekmede aç
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-burgundy px-3 py-1.5 text-xs font-semibold text-white hover:bg-burgundy-dark"
            >
              Kapat
            </button>
          </div>
        </div>

        <div className="h-[70vh] bg-soft-gray">
          <iframe title={title || 'PDF'} src={url} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

