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
  const [error, setError] = useState<string | null>(null);

  const load = useMemo(() => {
    return async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listEventsUpcoming({ limit: 200 });
        setItems(Array.isArray(res) ? res : []);
      } catch (e: any) {
        setError(e?.message ?? 'Etkinlikler yüklenemedi.');
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
          <h2 className="text-lg font-bold text-slate-900">Etkinlik Listesi</h2>
          <Link href="/" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Ana sayfaya dön →
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 space-y-3">
          {items.map((e) => (
            <div key={e.id} className="rounded-3xl bg-white p-5 shadow-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">{e.title}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    {(e.dateText || (e.eventDate ? formatDot(e.eventDate) : '')) || '—'}
                    {e.location ? ` • ${e.location}` : ''}
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-soft-gray px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {e.isPublished ? 'Yayında' : 'Taslak'}
                </div>
              </div>
            </div>
          ))}

          {loading ? <div className="text-sm text-slate-500">Yükleniyor…</div> : null}
          {!loading && items.length === 0 ? (
            <div className="rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">Henüz etkinlik eklenmemiş.</div>
          ) : null}
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

