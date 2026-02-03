'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { HomeBanner } from '../lib/api';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export function HomeBannerStrip({ banners, loading }: { banners: HomeBanner[]; loading?: boolean }) {
  const list = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const layerARef = useRef<HTMLDivElement | null>(null);
  const layerBRef = useRef<HTMLDivElement | null>(null);
  const activeLayerRef = useRef<'a' | 'b'>('a');
  const currentIndexRef = useRef(0);

  const [activeLayer, setActiveLayer] = useState<'a' | 'b'>('a');
  const [layerA, setLayerA] = useState<HomeBanner | null>(() => list[0] ?? null);
  const [layerB, setLayerB] = useState<HomeBanner | null>(() => list[0] ?? null);

  const activeBanner = (activeLayer === 'a' ? layerA : layerB) ?? list[0] ?? null;

  useEffect(() => {
    if (!list.length) return;
    activeLayerRef.current = 'a';
    currentIndexRef.current = 0;
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

  useEffect(() => {
    const len = list.length;
    if (len <= 1) return;
    let killed = false;
    const t = setInterval(() => {
      const fromLayer = activeLayerRef.current;
      const toLayer = fromLayer === 'a' ? 'b' : 'a';
      const nextIndex = (currentIndexRef.current + 1) % len;
      const nextBanner = list[nextIndex];

      // Put next banner into the hidden layer
      if (toLayer === 'a') setLayerA(nextBanner);
      else setLayerB(nextBanner);

      // Update title/href immediately to match the incoming banner
      setActiveLayer(toLayer);
      activeLayerRef.current = toLayer;
      currentIndexRef.current = nextIndex;

      // Animate transition
      (async () => {
        try {
          const mod: any = await import('gsap');
          const gsap = mod?.gsap || mod?.default || mod;
          if (!gsap || killed) return;

          const activeEl = fromLayer === 'a' ? layerARef.current : layerBRef.current;
          const nextEl = toLayer === 'a' ? layerARef.current : layerBRef.current;
          if (!activeEl || !nextEl) return;

          // Marvel-like wipe (left->right) with scale punch
          gsap.set(nextEl, { opacity: 1, zIndex: 3, clipPath: 'inset(0 100% 0 0)', scale: 1.06 });
          gsap.set(activeEl, { opacity: 1, zIndex: 2, clipPath: 'inset(0 0% 0 0)', scale: 1 });

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(activeEl, { opacity: 0, zIndex: 1, clipPath: 'inset(0 0% 0 0)', scale: 1 });
              gsap.set(nextEl, { opacity: 1, zIndex: 2, clipPath: 'inset(0 0% 0 0)', scale: 1 });
            },
          });
          tl.to(activeEl, { scale: 1.03, duration: 0.6, ease: 'power2.out' }, 0);
          tl.to(nextEl, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 0.85, ease: 'power3.inOut' }, 0);
          tl.to(activeEl, { opacity: 0.55, duration: 0.55, ease: 'power2.out' }, 0.1);
        } catch {
          // ignore
        }
      })();
    }, 6500);
    return () => {
      killed = true;
      clearInterval(t);
    };
  }, [list]);

  if (!list.length && loading) {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl bg-soft-gray shadow-card">
        <div className="h-[450px] animate-pulse" />
      </div>
    );
  }
  if (!list.length) return null;
  if (!activeBanner) return null;

  const layerAEffective = layerA ?? activeBanner;
  const layerBEffective = layerB ?? activeBanner;

  const content = (
    <div ref={rootRef} className="group relative w-full overflow-hidden rounded-3xl bg-slate-900 shadow-card">
      <div className="relative h-[140px] sm:h-[165px] md:h-[190px]">
        {/* Layer A */}
        <div
          ref={layerARef}
          className={`absolute inset-0 ${activeLayer === 'a' ? 'z-20 opacity-100' : 'z-10 opacity-0'}`}
        >
          <Image
            src={normalizeImageSrc(layerAEffective.imageUrl)}
            alt={layerAEffective.title}
            fill
            sizes="(min-width: 1920px) 1950px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        {/* Layer B */}
        <div
          ref={layerBRef}
          className={`absolute inset-0 ${activeLayer === 'b' ? 'z-20 opacity-100' : 'z-10 opacity-0'}`}
        >
          <Image
            src={normalizeImageSrc(layerBEffective.imageUrl)}
            alt={layerBEffective.title}
            fill
            sizes="(min-width: 1920px) 1950px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4 sm:p-5">
          <div className="w-full truncate rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur">
            {activeBanner.title}
          </div>
        </div>
      </div>
    </div>
  );

  if (isInternalHref(activeBanner.href)) {
    return (
      <Link href={activeBanner.href} className="block" aria-label={activeBanner.title}>
        {content}
      </Link>
    );
  }

  return (
    <a href={activeBanner.href} className="block" target="_blank" rel="noreferrer" aria-label={activeBanner.title}>
      {content}
    </a>
  );
}

