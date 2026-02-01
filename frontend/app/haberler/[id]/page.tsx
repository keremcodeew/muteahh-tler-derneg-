'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PageLayoutWithFooter } from '../../../components/PageLayout';
import { getNewsById, type News } from '../../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? String(params.id) : '';

  const [item, setItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = item?.title || 'Haber';
  const dateText = item?.publishDate ? formatDot(item.publishDate) : '';

  const contentLines = useMemo(() => {
    const c = item?.content ? String(item.content) : '';
    return c;
  }, [item?.content]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getNewsById(id);
        if (cancelled) return;
        setItem(res);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? 'Haber yüklenemedi.');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <PageLayoutWithFooter>
      <section className="rounded-3xl bg-slate-900 p-6 shadow-card sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-white/70">Antalya Müteahhitler Derneği</div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/haberler"
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              Haberler →
            </Link>
            <Link href="/" className="rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-white hover:bg-burgundy-dark">
              Ana Sayfa
            </Link>
          </div>
        </div>

        <h1 className="mt-4 text-xl font-bold text-white sm:text-2xl">{title}</h1>
        {dateText ? <p className="mt-2 text-sm text-white/75">{dateText}</p> : null}
      </section>

      <section className="mt-6">
        {loading ? (
          <div className="rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Yükleniyor…</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        ) : !item ? (
          <div className="rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Haber bulunamadı.</div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-card">
            <div className="relative h-[220px] sm:h-[320px]">
              <Image
                src={item.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              {item.excerpt ? <p className="text-sm text-slate-600">{item.excerpt}</p> : null}
              <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{contentLines}</div>
            </div>
          </div>
        )}
      </section>
    </PageLayoutWithFooter>
  );
}

