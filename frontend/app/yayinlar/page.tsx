'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';
import { listPublicationsPublic, type Publication } from '../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export default function PublicationsPage() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ url: string; title: string } | null>(null);

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        const res = await listPublicationsPublic({ page: 1, limit: 50 });
        if (res?.items?.length) setItems(res.items);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Yayınlar" subtitle="Raporlar, bültenler ve yayın arşivi." />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Yayın Arşivi</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="rounded-3xl bg-white p-6 shadow-card">
              <p className="text-xs font-semibold text-slate-500">{formatDot(p.publishDate)}</p>
              <h3 className="mt-2 text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt || ''}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={p.fileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-soft-gray"
                >
                  PDF İndir
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (!p.fileUrl) return;
                    setPreview({ url: p.fileUrl, title: p.title });
                  }}
                  disabled={!p.fileUrl}
                  className="inline-flex rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ÖNİZLEME
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
      </section>

      <PdfPreviewModal
        open={!!preview}
        url={preview?.url ?? null}
        title={preview?.title}
        onClose={() => setPreview(null)}
      />
    </PageLayoutWithFooter>
  );
}

