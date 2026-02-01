'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { listMembersPublic } from '../../lib/api';

function MembersPageInner() {
  const sp = useSearchParams();
  const urlSearch = useMemo(() => (sp.get('search') || '').trim(), [sp]);

  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    setSearch(urlSearch);
    setPage(1);
  }, [urlSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listMembersPublic({ page, limit: 12, search: effectiveSearch || undefined })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotalPages(res.totalPages || 1);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.message ?? 'Üyeler yüklenemedi.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, effectiveSearch]);

  return (
    <PageLayoutWithFooter>
      <PageHero
        title="Üyelerimiz"
        subtitle="Kayıt olan ve onaylanan üyelerimizi burada görüntüleyebilirsiniz. (Onaysız üyeler listelenmez.)"
      />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Üye Dizini</h2>
            <p className="mt-1 text-sm text-slate-600">İsim / firma / rol ile arayabilirsiniz.</p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Arama…"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy sm:w-[320px]"
            />
          </div>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-black/5 bg-soft-gray p-5">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
                </div>
              ))
            : items.map((m) => (
                <div key={m.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{m.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{m.company || '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-soft-gray px-3 py-1 text-xs font-semibold text-slate-700">
                      {m.role || 'Üye'}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{m.email}</p>
                  <p className="mt-1 text-xs text-slate-400">Kayıt: {m.joinDate || '—'}</p>
                </div>
              ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Önceki
          </button>
          <div className="text-sm font-semibold text-slate-600">
            {page} / {totalPages}
          </div>
          <button
            type="button"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Sonraki →
          </button>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-white" />}>
      <MembersPageInner />
    </Suspense>
  );
}

