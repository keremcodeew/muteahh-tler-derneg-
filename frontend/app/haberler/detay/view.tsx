'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '../../../components/PageHero';
import { PageLayoutWithFooter } from '../../../components/PageLayout';

type NewsDetail = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishDate: string;
};

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export function NewsDetailView() {
  const sp = useSearchParams();
  const id = sp.get('id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<NewsDetail | null>(null);

  const safeId = useMemo(() => {
    const n = Number(id || '');
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!safeId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/news/${safeId}`, { method: 'GET' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || data?.message || `Request failed: ${res.status}`);
        if (cancelled) return;
        setItem(data as NewsDetail);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Haber yüklenemedi.');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [safeId]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Haber Detayı" subtitle="Haber içeriğini görüntüleyin." />

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/haberler" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            ← Haberler
          </Link>
          {item?.publishDate ? <div className="text-xs font-semibold text-slate-500">{formatDot(item.publishDate)}</div> : null}
        </div>

        {!safeId ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Haber bulunamadı.
          </div>
        ) : loading ? (
          <div className="mt-6 rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Yükleniyor…</div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : !item ? (
          <div className="mt-6 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
            Haber bulunamadı.
          </div>
        ) : (
          <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
            {item.imageUrl ? (
              <div className="relative aspect-[21/9] w-full">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              </div>
            ) : null}
            <div className="p-6">
              <h1 className="text-xl font-bold text-slate-900">{item.title}</h1>
              {item.excerpt ? <p className="mt-3 text-sm text-slate-600">{item.excerpt}</p> : null}
              <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{item.content}</div>
            </div>
          </article>
        )}
      </section>
    </PageLayoutWithFooter>
  );
}

