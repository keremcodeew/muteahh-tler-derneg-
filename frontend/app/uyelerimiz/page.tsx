'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { listMembersPublic, type MembersListResponse } from '../../lib/api';

type PublicMember = MembersListResponse['items'][number];

function normalizeWebsiteUrl(raw: string | null | undefined): string | null {
  const v = String(raw || '').trim();
  if (!v) return null;
  const lower = v.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) return null;
  if (lower.startsWith('http://') || lower.startsWith('https://')) return v;
  // allow "www.example.com" or "example.com"
  return `https://${v.replace(/^\/+/, '')}`;
}

function MembersPageInner() {
  const sp = useSearchParams();
  const urlSearch = useMemo(() => (sp.get('search') || '').trim(), [sp]);

  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PublicMember[]>([]);
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
        subtitle="Kayıt olan ve onaylanan üyelerimizi burada görüntüleyebilirsiniz. (Onaysız üyeler listelenmez.) Üyenin üzerine tıklayınca web sitesi açılır."
      />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Üye Dizini</h2>
            <p className="mt-1 text-sm text-slate-600">İsim / firma / ünvan ile arayabilirsiniz.</p>
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

        <div className="mt-6 space-y-0 overflow-hidden rounded-3xl border border-black/5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-black/5 bg-white px-5 py-5 last:border-b-0">
                  <div className="h-7 w-12 rounded bg-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              ))
            : items.map((m, idx) => {
                const href = normalizeWebsiteUrl(m.websiteUrl);
                const companyOrName = (m.company || m.name || '').trim();
                const personName = m.company ? m.name : m.role || '';

                const Row = (
                  <div
                    className={`flex items-center gap-4 border-b border-black/5 px-5 py-5 transition-colors ${
                      href ? 'bg-white hover:bg-soft-gray' : 'bg-white'
                    } last:border-b-0`}
                  >
                    <div className="w-14 shrink-0 text-right text-2xl font-extrabold tracking-tight text-slate-500">
                      {m.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{companyOrName || '—'}</div>
                          <div className="mt-1 truncate text-sm font-semibold text-slate-700">{personName || '—'}</div>
                        </div>
                        <div className="shrink-0 text-xs font-semibold text-slate-500">
                          {href ? 'Web Sitesi →' : 'Web sitesi yok'}
                        </div>
                      </div>
                    </div>
                  </div>
                );

                if (!href) return <div key={m.id || idx}>{Row}</div>;
                return (
                  <a key={m.id} href={href} target="_blank" rel="noreferrer" className="block">
                    {Row}
                  </a>
                );
              })}
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

