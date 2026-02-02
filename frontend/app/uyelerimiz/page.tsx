'use client';

/* eslint-disable @next/next/no-img-element */

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { listMembersPublic, type MembersListResponse } from '../../lib/api';
import { normalizeImageSrc } from '../../lib/normalizeImageSrc';

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

function initialsFrom(name: string) {
  const s = (name || '').trim();
  if (!s) return 'AMD';
  const parts = s.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
  const out = (first + last).toUpperCase();
  return out || 'AMD';
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
        subtitle="Kayıt olan ve onaylanan üyelerimizi burada görüntüleyebilirsiniz. (Onaysız üyeler listelenmez.)"
      />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Üye Dizini</h2>
            <p className="mt-1 text-sm text-slate-600">Üyenin kartına tıklayınca web sitesi açılır.</p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Arama…"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy sm:w-[360px]"
            />
          </div>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-[260px] rounded bg-soft-gray shadow-card">
                  <div className="h-full animate-pulse" />
                </div>
              ))
            : items.map((m) => {
                const href = normalizeWebsiteUrl(m.websiteUrl);
                const company = (m.company || m.name || '—').trim();
                const person = (m.company ? m.name : m.role) || '—';

                const logoSrc = normalizeImageSrc(m.profileImageUrl);
                const Card = (
                  <div className="group h-[260px] rounded bg-white shadow-card ring-1 ring-black/10 transition-transform hover:-translate-y-0.5">
                    <div className="flex h-full flex-col p-5">
                      <div className="grid flex-1 place-items-center rounded bg-white">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={company}
                            className="max-h-[120px] w-auto max-w-[180px] object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid size-24 place-items-center rounded-full bg-soft-gray text-2xl font-extrabold tracking-wide text-slate-600">
                            {initialsFrom(company)}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <div className="truncate text-sm font-extrabold uppercase tracking-wide text-slate-700">{company}</div>
                        <div className="mt-1 truncate text-sm font-semibold text-slate-500">{person}</div>
                      </div>
                      <div className="mt-4 text-center text-xs font-semibold text-slate-400">
                        {href ? <span className="text-burgundy group-hover:text-burgundy-dark">Web Sitesi →</span> : 'Web sitesi yok'}
                      </div>
                    </div>
                  </div>
                );

                if (!href) return <div key={m.id}>{Card}</div>;
                return (
                  <a key={m.id} href={href} target="_blank" rel="noreferrer" className="block">
                    {Card}
                  </a>
                );
              })}
        </div>

        <div className="mt-8 flex items-center justify-between">
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

