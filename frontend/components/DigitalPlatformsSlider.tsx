'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type DigitalPlatformItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  ctaLabel?: string;
  accent?: 'burgundy' | 'emerald' | 'sky' | 'slate';
};

function isInternalHref(href: string) {
  return href.startsWith('/');
}

function accentClasses(accent: DigitalPlatformItem['accent']) {
  switch (accent) {
    case 'emerald':
      return {
        pill: 'bg-emerald-100 text-emerald-800',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        ring: 'ring-emerald-500/15',
        glow: 'from-emerald-400/18 via-transparent to-transparent',
      };
    case 'sky':
      return {
        pill: 'bg-sky-100 text-sky-800',
        button: 'bg-sky-600 hover:bg-sky-700',
        ring: 'ring-sky-500/15',
        glow: 'from-sky-400/18 via-transparent to-transparent',
      };
    case 'slate':
      return {
        pill: 'bg-slate-100 text-slate-800',
        button: 'bg-slate-800 hover:bg-slate-900',
        ring: 'ring-slate-500/15',
        glow: 'from-slate-400/16 via-transparent to-transparent',
      };
    case 'burgundy':
    default:
      return {
        pill: 'bg-burgundy/10 text-burgundy-dark',
        button: 'bg-burgundy hover:bg-burgundy-dark',
        ring: 'ring-burgundy/15',
        glow: 'from-burgundy/18 via-transparent to-transparent',
      };
  }
}

function PlatformCard({ item }: { item: DigitalPlatformItem }) {
  const a = accentClasses(item.accent);
  const cta = item.ctaLabel || 'SİSTEME GİRİŞ';

  const inner = (
    <div className={`relative overflow-hidden rounded-3xl bg-white shadow-card ring-1 ${a.ring}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow}`} />
      <div className="relative p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${a.pill}`}>DİJİTAL PLATFORM</span>
          <span className="text-xs font-semibold text-slate-500">{item.subtitle}</span>
        </div>
        <h3 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{item.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${a.button}`}>
            {cta} →
          </span>
        </div>
      </div>
    </div>
  );

  if (isInternalHref(item.href)) {
    return (
      <Link href={item.href} className="block" aria-label={cta}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noreferrer" className="block" aria-label={cta}>
      {inner}
    </a>
  );
}

export function DigitalPlatformsSlider({
  title = 'Dijital Platformlar',
  items,
}: {
  title?: string;
  items?: DigitalPlatformItem[];
}) {
  const list = useMemo<DigitalPlatformItem[]>(() => {
    if (Array.isArray(items) && items.length) return items;
    return [
      {
        id: 'tas',
        title: 'Taşeron Sistemi',
        subtitle: 'Güvenilir iş ortakları',
        description:
          'Üyelerimize iyi taşeronlar, taşeronlarımıza yeni müşteriler kazandırıyoruz. Kurumsal yapı ile doğru iş birliklerini hızlandırıyoruz.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'burgundy',
      },
      {
        id: 'emlak',
        title: 'Emlak Yönetim Sistemi',
        subtitle: 'Güçlü bir vitrin',
        description:
          'Üyelere özel iş ağı: emlak profesyonelleri portföylerini sunar, müteahhitler doğru gayrimenkul kaynaklarına hızlı erişir.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'emerald',
      },
      {
        id: 'teknik',
        title: 'Teknik Proje Hizmetleri',
        subtitle: 'Uzmanlarla buluşun',
        description:
          'Mimar, mühendis ve teknik proje profesyonelleriyle kurumsal bir platformda buluşun; projelerinize uygun uzmanlara hızlıca ulaşın.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'sky',
      },
      {
        id: 'tedarik',
        title: 'İnşaat Malzemesi Tedarik Sistemi',
        subtitle: 'Güvenilir tedarik',
        description:
          'İnşaat süreçlerinde ihtiyaç duyduğunuz malzemeleri, güvenilir tedarikçilerle buluşturan kurumsal bir sistem.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'slate',
      },
    ];
  }, [items]);

  const layerARef = useRef<HTMLDivElement | null>(null);
  const layerBRef = useRef<HTMLDivElement | null>(null);
  const activeLayerRef = useRef<'a' | 'b'>('a');
  const idxRef = useRef(0);
  const animatingRef = useRef(false);

  const [activeLayer, setActiveLayer] = useState<'a' | 'b'>('a');
  const [layerA, setLayerA] = useState<DigitalPlatformItem>(() => list[0]);
  const [layerB, setLayerB] = useState<DigitalPlatformItem>(() => list[0]);
  const [paused, setPaused] = useState(false);

  const activeItem = activeLayer === 'a' ? layerA : layerB;

  useEffect(() => {
    if (!list.length) return;
    idxRef.current = 0;
    activeLayerRef.current = 'a';
    setActiveLayer('a');
    setLayerA(list[0]);
    setLayerB(list[0]);
    (async () => {
      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap) return;
        if (layerARef.current) gsap.set(layerARef.current, { opacity: 1, zIndex: 2, clipPath: 'inset(0 0% 0 0)', scale: 1 });
        if (layerBRef.current) gsap.set(layerBRef.current, { opacity: 0, zIndex: 1, clipPath: 'inset(0 0% 0 0)', scale: 1 });
      } catch {
      }
    })();
  }, [list]);

  const goTo = useCallback(async (nextIndex: number) => {
    const len = list.length;
    if (len <= 1) return;
    const target = ((nextIndex % len) + len) % len;
    if (target === idxRef.current) return;
    if (animatingRef.current) return;
    animatingRef.current = true;

    const fromLayer = activeLayerRef.current;
    const toLayer = fromLayer === 'a' ? 'b' : 'a';
    const nextItem = list[target];

    if (toLayer === 'a') setLayerA(nextItem);
    else setLayerB(nextItem);

    setActiveLayer(toLayer);
    activeLayerRef.current = toLayer;
    idxRef.current = target;

    try {
      const mod: any = await import('gsap');
      const gsap = mod?.gsap || mod?.default || mod;
      if (!gsap) {
        animatingRef.current = false;
        return;
      }

      const activeEl = fromLayer === 'a' ? layerARef.current : layerBRef.current;
      const nextEl = toLayer === 'a' ? layerARef.current : layerBRef.current;
      if (!activeEl || !nextEl) {
        animatingRef.current = false;
        return;
      }

      // Marvel-like wipe: new slide reveals while old dims & scales slightly.
      gsap.set(nextEl, { opacity: 1, zIndex: 3, clipPath: 'inset(0 100% 0 0)', scale: 1.03 });
      gsap.set(activeEl, { opacity: 1, zIndex: 2, clipPath: 'inset(0 0% 0 0)', scale: 1 });

      gsap.timeline({
        onComplete: () => {
          gsap.set(activeEl, { opacity: 0, zIndex: 1, clipPath: 'inset(0 0% 0 0)', scale: 1 });
          gsap.set(nextEl, { opacity: 1, zIndex: 2, clipPath: 'inset(0 0% 0 0)', scale: 1 });
          animatingRef.current = false;
        },
      })
        .to(activeEl, { opacity: 0.55, duration: 0.45, ease: 'power2.out' }, 0)
        .to(activeEl, { scale: 1.02, duration: 0.55, ease: 'power2.out' }, 0)
        .to(nextEl, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 0.75, ease: 'power3.inOut' }, 0);
    } catch {
      animatingRef.current = false;
    }
  }, [list]);

  useEffect(() => {
    if (list.length <= 1) return;
    if (paused) return;
    const t = setInterval(() => {
      void goTo(idxRef.current + 1);
    }, 6500);
    return () => clearInterval(t);
  }, [goTo, list.length, paused]);

  if (!list.length) return null;

  return (
    <section
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Dijital platformlar"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-black/10 bg-white text-slate-700 transition-colors hover:bg-soft-gray"
            aria-label="Önceki"
            onClick={() => void goTo(idxRef.current - 1)}
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-black/10 bg-white text-slate-700 transition-colors hover:bg-soft-gray"
            aria-label="Sonraki"
            onClick={() => void goTo(idxRef.current + 1)}
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-3xl">
        <div ref={layerARef} className={`absolute inset-0 ${activeLayer === 'a' ? 'z-20 opacity-100' : 'z-10 opacity-0'}`}>
          <PlatformCard item={layerA} />
        </div>
        <div ref={layerBRef} className={`absolute inset-0 ${activeLayer === 'b' ? 'z-20 opacity-100' : 'z-10 opacity-0'}`}>
          <PlatformCard item={layerB} />
        </div>
        {/* Height keeper */}
        <div className="invisible">
          <PlatformCard item={activeItem} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {list.map((it, i) => {
            const active = i === idxRef.current;
            return (
              <button
                key={it.id}
                type="button"
                aria-label={`${it.title} seç`}
                onClick={() => void goTo(i)}
                className={`h-2.5 rounded-full transition-all ${active ? 'w-9 bg-burgundy' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
              />
            );
          })}
        </div>
        <div className="text-xs font-semibold text-slate-500">Otomatik geçiş {paused ? 'duraklatıldı' : 'açık'}</div>
      </div>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

