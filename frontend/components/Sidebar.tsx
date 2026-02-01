'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { EventItem } from '../lib/dummyData';
import { listMembersPublic } from '../lib/api';

type Props = {
  events: EventItem[];
  loadingEvents?: boolean;
};

export function Sidebar({ events, loadingEvents }: Props) {
  const router = useRouter();

  const memberTypes = useMemo(
    () => [
      { value: 'all', label: 'Tüm Üyeler' },
      { value: 'a', label: 'A Grubu' },
      { value: 'b', label: 'B Grubu' },
      { value: 'c', label: 'C Grubu' },
    ],
    []
  );

  const [type, setType] = useState(memberTypes[0]?.value ?? 'all');
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  return (
    <aside className="space-y-6">
      {/* Üye Arama */}
      <div className="rounded-3xl bg-white p-5 shadow-card">
        <h3 className="text-sm font-bold text-slate-900">Üye Arama</h3>

        <div className="mt-4 space-y-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Üye tipi"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
          >
            {memberTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Firma adı veya anahtar kelime"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
          />

          {/* Dummy action */}
          <button
            type="button"
            className="w-full rounded-full bg-soft-gray px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            disabled={searching}
            onClick={async () => {
              const query = q.trim();
              setSearchError(null);
              setResults([]);
              if (!query) {
                router.push('/uyelerimiz');
                return;
              }
              setSearching(true);
              try {
                // Backend public endpoint lists ONLY approved members.
                const res = await listMembersPublic({ page: 1, limit: 6, search: query });
                setResults(res.items || []);
              } catch (e: any) {
                setSearchError(e?.message ?? 'Arama başarısız.');
              } finally {
                setSearching(false);
              }
            }}
          >
            {searching ? 'Aranıyor…' : 'Ara'}
          </button>

          {searchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchError}</div>
          ) : null}

          {results.length ? (
            <div className="rounded-3xl border border-black/5 bg-white p-3">
              <p className="px-2 pb-2 text-xs font-semibold text-slate-500">Sonuçlar</p>
              <div className="divide-y divide-black/5">
                {results.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => router.push(`/uyelerimiz?search=${encodeURIComponent(q.trim())}`)}
                    className="flex w-full items-start justify-between gap-3 px-2 py-2 text-left hover:bg-soft-gray"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{m.name}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-500">{m.company || '—'}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-soft-gray px-2 py-1 text-[11px] font-semibold text-slate-700">
                      {m.role || 'Üye'}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href={`/uyelerimiz?search=${encodeURIComponent(q.trim())}`}
                  className="px-2 text-sm font-semibold text-burgundy hover:text-burgundy-dark"
                >
                  Tüm sonuçları gör →
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Link
            href={q.trim() ? `/uyelerimiz?search=${encodeURIComponent(q.trim())}` : '/uyelerimiz'}
            className="text-sm font-semibold text-burgundy hover:text-burgundy-dark"
          >
            Detaylı Üye Arama →
          </Link>
        </div>
      </div>

      {/* Sektörel Paydaşlar */}
      <button
        type="button"
        className="w-full rounded-full bg-soft-gray px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
      >
        SEKTÖREL PAYDAŞLAR
      </button>

      {/* Etkinlikler */}
      <div className="rounded-3xl bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Etkinlikler</h3>
          <Link href="/etkinlikler" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
            Tümünü Gör →
          </Link>
        </div>

        <ul className="mt-4 space-y-3">
          {loadingEvents ? (
            <>
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-1 inline-block size-3 shrink-0 rounded-full bg-slate-300" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-7/12 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-300">
                    <SmallArrow />
                  </div>
                </li>
              ))}
            </>
          ) : events.length ? (
            events.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`mt-1 inline-block size-3 shrink-0 rounded-full ${dotColor(e.color)}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">{e.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {e.date} • {e.location}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-200"
                  aria-label="Aç"
                >
                  <SmallArrow />
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-600">Etkinlik bulunamadı.</li>
          )}
        </ul>
      </div>
    </aside>
  );
}

function dotColor(color: EventItem['color']) {
  switch (color) {
    case 'burgundy':
      return 'bg-burgundy';
    case 'green':
      return 'bg-emerald-500';
    case 'blue':
      return 'bg-sky-500';
    default:
      return 'bg-slate-400';
  }
}

function SmallArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

