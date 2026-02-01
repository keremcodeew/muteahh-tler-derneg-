'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { listEventsUpcoming, type Event } from '../../lib/api';

function formatDot(iso: string | null | undefined) {
  if (!iso) return '';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export default function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      try {
        const res = await listEventsUpcoming({ limit: 50 });
        if (Array.isArray(res)) setItems(res);
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
      <PageHero title="Etkinlikler" subtitle="Derneğimizin etkinlik takvimi ve duyuruları." />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Yaklaşan Etkinlikler</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {items.map((e) => (
            <div key={e.id} className="rounded-3xl bg-white p-5 shadow-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">{e.title}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {(e.dateText || (e.eventDate ? formatDot(e.eventDate) : '')) || '—'}
                    {e.location ? ` • ${e.location}` : ''}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-soft-gray px-3 py-1 text-xs font-semibold text-slate-700">
                  {e.isPublished ? 'Yayında' : 'Taslak'}
                </span>
              </div>
            </div>
          ))}

          {!loading && items.length === 0 ? (
            <div className="rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
              Henüz etkinlik eklenmemiş.
            </div>
          ) : null}
        </div>

        {loading ? <div className="mt-6 text-sm text-slate-500">Yükleniyor…</div> : null}
      </section>
    </PageLayoutWithFooter>
  );
}

