'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { HomeBanner } from '../lib/api';

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export function HomeBannerStrip({ banner }: { banner: HomeBanner | null }) {
  if (!banner) return null;

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let killed = false;
    (async () => {
      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap || !rootRef.current || killed) return;
        gsap.fromTo(
          rootRef.current,
          { opacity: 0, y: 10, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power2.out' }
        );
      } catch {
        // If gsap isn't available, silently skip animation.
      }
    })();
    return () => {
      killed = true;
    };
  }, [banner.id]);

  const content = (
    <div
      ref={rootRef}
      className="group relative w-full overflow-hidden rounded-3xl bg-slate-900 shadow-card"
    >
      <div className="relative h-[120px] sm:h-[150px] md:h-[180px]">
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          sizes="(min-width: 1024px) 1152px, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-end p-4 sm:p-5">
          <div className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur">
            {banner.title}
          </div>
        </div>
      </div>
    </div>
  );

  if (isInternalHref(banner.href)) {
    return (
      <Link href={banner.href} className="block" aria-label={banner.title}>
        {content}
      </Link>
    );
  }

  return (
    <a href={banner.href} className="block" target="_blank" rel="noreferrer" aria-label={banner.title}>
      {content}
    </a>
  );
}

