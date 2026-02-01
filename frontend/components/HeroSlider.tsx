'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SliderItem } from '../lib/dummyData';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  items: SliderItem[];
};

export function HeroSlider({ items }: Props) {
  const safeItems = useMemo(() => items ?? [], [items]);
  const [idx, setIdx] = useState(0);

  const len = safeItems.length;
  const current = len ? safeItems[idx % len] : null;

  // Autoplay (soft transitions)
  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % len), 6500);
    return () => clearInterval(t);
  }, [len]);

  if (!current) return null;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-slate-900">
      <div className="relative h-[360px] md:h-[460px] lg:h-[520px]">
        <Image
          src={normalizeImageSrc(current.imageUrl)}
          alt={current.title}
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay (corporate slider) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

        {/* Left-bottom content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-10">
            <p className="text-xs font-medium text-white/80 md:text-sm">{current.date}</p>
            <h1 className="mt-2 max-w-3xl text-2xl font-bold text-white md:text-3xl lg:text-4xl">
              {current.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/90 md:text-base">
              {current.description}
            </p>

            <div className="mt-5">
              <Link
                href="/kurumsal"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-slate-900"
              >
                DETAYLI İNCELE
              </Link>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => setIdx((v) => (v - 1 + len) % len)}
          className="absolute left-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Önceki"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => setIdx((v) => (v + 1) % len)}
          className="absolute right-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Sonraki"
        >
          <ChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
            {safeItems.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIdx(i)}
                className={`size-2 rounded-full transition-colors ${
                  i === idx ? 'bg-burgundy' : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

