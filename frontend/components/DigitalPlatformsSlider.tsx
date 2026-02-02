'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

export type DigitalPlatformItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  ctaLabel?: string;
  accent?: 'burgundy' | 'emerald' | 'sky' | 'slate';
  backgroundImageUrl?: string;
};

function isInternalHref(href: string) {
  return href.startsWith('/');
}

function themeClasses(accent: DigitalPlatformItem['accent']) {
  switch (accent) {
    case 'emerald':
      // Warm (gold) overlay like the reference second block.
      return {
        overlay: 'bg-amber-300/70',
        text: 'text-slate-900',
        subText: 'text-slate-900/90',
        pill: 'bg-white/70 text-slate-900',
        button: 'border-slate-900/60 text-slate-900 hover:bg-black/5',
        buttonFill: 'bg-slate-900 text-white hover:bg-slate-950',
      };
    case 'sky':
      return {
        overlay: 'bg-sky-950/55',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/15 text-white',
        button: 'border-white/60 text-white hover:bg-white/10',
        buttonFill: 'bg-white/90 text-slate-900 hover:bg-white',
      };
    case 'slate':
      return {
        overlay: 'bg-slate-950/60',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/15 text-white',
        button: 'border-white/60 text-white hover:bg-white/10',
        buttonFill: 'bg-white/90 text-slate-900 hover:bg-white',
      };
    case 'burgundy':
    default:
      return {
        overlay: 'bg-slate-950/58',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/15 text-white',
        button: 'border-white/60 text-white hover:bg-white/10',
        buttonFill: 'bg-white/90 text-slate-900 hover:bg-white',
      };
  }
}

function PlatformBlock({
  item,
  align = 'left',
  contentRef,
}: {
  item: DigitalPlatformItem;
  align?: 'left' | 'right';
  contentRef?: (el: HTMLDivElement | null) => void;
}) {
  const t = themeClasses(item.accent);
  const cta = item.ctaLabel || 'SİSTEME GİRİŞ';
  const bg =
    item.backgroundImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70';

  const inner = (
    <div className="relative w-full">
      <div className="absolute inset-0">
        <Image
          src={bg}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        <div className={`absolute inset-0 backdrop-blur-[2px] ${t.overlay}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-black/20" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className={`flex w-full ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <div
            ref={contentRef}
            className={`w-full max-w-xl ${align === 'right' ? 'text-right' : 'text-left'}`}
          >
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${t.pill}`}>
              DİJİTAL PLATFORM
            </div>

            <h3 className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${t.text}`}>{item.title}</h3>
            <div className={`mt-4 text-lg font-semibold sm:text-xl ${t.subText}`}>{item.subtitle}</div>
            <p className={`mt-4 text-sm leading-relaxed sm:text-base ${t.subText}`}>{item.description}</p>

            <div className={`mt-7 flex flex-wrap items-center gap-3 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
              <span className={`inline-flex items-center rounded-md border px-5 py-3 text-sm font-bold tracking-wide ${t.button}`}>
                {cta}
              </span>
            </div>
          </div>
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
        subtitle: 'Üyelerimize iyi taşeronlar, taşeronlarımıza yeni müşteriler kazandırıyoruz!',
        description:
          'Üyelerimize iyi taşeronlar, taşeronlarımıza yeni müşteriler kazandırıyoruz. Kurumsal yapı ile doğru iş birliklerini hızlandırıyoruz.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'burgundy',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=2400&q=70',
      },
      {
        id: 'emlak',
        title: 'Emlak Yönetim Sistemi',
        subtitle: 'Üyelerimize özel, emlak dünyasında güçlü bir vitrin',
        description:
          'Üyelere özel iş ağı: emlak profesyonelleri portföylerini sunar, müteahhitler doğru gayrimenkul kaynaklarına hızlı erişir.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'emerald',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70',
      },
      {
        id: 'teknik',
        title: 'Teknik Proje Hizmetleri',
        subtitle: 'Teknik bilgi, doğru projelerle buluşuyor.',
        description:
          'Mimar, mühendis ve teknik proje profesyonelleriyle kurumsal bir platformda buluşun; projelerinize uygun uzmanlara hızlıca ulaşın.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'sky',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2400&q=70',
      },
      {
        id: 'tedarik',
        title: 'İnşaat Malzemesi Tedarik Sistemi',
        subtitle: 'Kaliteli malzeme, güçlü iş birlikleri.',
        description:
          'İnşaat süreçlerinde ihtiyaç duyduğunuz malzemeleri, güvenilir tedarikçilerle buluşturan kurumsal bir sistem.',
        href: '/login',
        ctaLabel: 'SİSTEME GİRİŞ',
        accent: 'slate',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2400&q=70',
      },
    ];
  }, [items]);

  const contentElsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!list.length) return;

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return;
    }

    let obs: IntersectionObserver | null = null;
    let disconnected = false;

    const els = contentElsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    (async () => {
      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap) return;

        // Start hidden; reveal text as user scrolls down (zigzag direction).
        els.forEach((el) => {
          const dir = el.getAttribute('data-anim-dir') === 'right' ? 1 : -1;
          gsap.set(el, { opacity: 0, x: 42 * dir, y: 10 });
        });

        obs = new IntersectionObserver(
          (entries) => {
            if (disconnected) return;
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const el = entry.target as HTMLDivElement;
              gsap.to(el, { opacity: 1, x: 0, y: 0, duration: 0.85, ease: 'power3.out' });
              obs?.unobserve(el);
            }
          },
          { threshold: 0.22, rootMargin: '0px 0px -12% 0px' }
        );

        for (const el of els) obs.observe(el);
      } catch {
      }
    })();

    return () => {
      disconnected = true;
      obs?.disconnect();
    };
  }, [list]);

  if (!list.length) return null;

  return (
    <section className="w-full" aria-label="Dijital platformlar">
      <div className="mb-6">
        <h2 className="text-center text-xl font-extrabold tracking-wide text-slate-900 sm:text-2xl lg:text-3xl">
          {title}
        </h2>
      </div>

      <div className="w-full overflow-hidden rounded-3xl ring-1 ring-black/10">
        {list.map((item, idx) => {
          const align: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
          const animDir: 'left' | 'right' = align === 'left' ? 'left' : 'right';
          return (
            <div key={item.id}>
              {idx > 0 ? <div className="h-2 w-full bg-slate-950" /> : null}
              <PlatformBlock
                item={item}
                align={align}
                contentRef={(el) => {
                  if (el) el.setAttribute('data-anim-dir', animDir);
                  contentElsRef.current[idx] = el;
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

