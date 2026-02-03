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
  // Tüm accent'ler için bordo-kırmızı tema
  switch (accent) {
    case 'emerald':
      return {
        overlay: 'bg-red-900/75',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-red-900 hover:bg-white',
      };
    case 'sky':
      return {
        overlay: 'bg-red-950/70',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-red-900 hover:bg-white',
      };
    case 'slate':
      return {
        overlay: 'bg-red-800/75',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-red-900 hover:bg-white',
      };
    case 'burgundy':
    default:
      return {
        overlay: 'bg-red-950/75',
        text: 'text-white',
        subText: 'text-white/90',
        pill: 'bg-white/20 text-white',
        button: 'border-white/70 text-white hover:bg-white/15',
        buttonFill: 'bg-white/95 text-red-900 hover:bg-white',
      };
  }
}

function PlatformBlock({
  item,
  align = 'left',
  cardRef,
  imageRef,
  overlayRef,
  gradientRef,
  contentRef,
  pillRef,
  titleRef,
  subtitleRef,
  descRef,
  buttonRef,
}: {
  item: DigitalPlatformItem;
  align?: 'left' | 'right';
  cardRef?: (el: HTMLDivElement | null) => void;
  imageRef?: (el: HTMLDivElement | null) => void;
  overlayRef?: (el: HTMLDivElement | null) => void;
  gradientRef?: (el: HTMLDivElement | null) => void;
  contentRef?: (el: HTMLDivElement | null) => void;
  pillRef?: (el: HTMLDivElement | null) => void;
  titleRef?: (el: HTMLHeadingElement | null) => void;
  subtitleRef?: (el: HTMLDivElement | null) => void;
  descRef?: (el: HTMLParagraphElement | null) => void;
  buttonRef?: (el: HTMLSpanElement | null) => void;
}) {
  const t = themeClasses(item.accent);
  const cta = item.ctaLabel || 'SİSTEME GİRİŞ';
  const bg =
    item.backgroundImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70';

  const inner = (
    <div ref={cardRef} className="relative w-full">
      <div ref={imageRef} className="absolute inset-0 overflow-hidden">
        <Image
          src={bg}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
        <div ref={overlayRef} className={`absolute inset-0 backdrop-blur-[2px] ${t.overlay}`} />
        <div ref={gradientRef} className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-red-900/20 to-red-800/30" />
      </div>

      <div className="relative w-full min-w-0 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className={`flex w-full min-w-0 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <div
            ref={contentRef}
            className={`min-w-0 flex-1 ${align === 'right' ? 'text-right' : 'text-left'}`}
          >
            <div
              ref={pillRef}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${t.pill}`}
            >
              DİJİTAL PLATFORM
            </div>

            <h3
              ref={titleRef}
              className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${t.text}`}
            >
              {item.title}
            </h3>
            <div
              ref={subtitleRef}
              className={`mt-4 text-lg font-semibold sm:text-xl ${t.subText}`}
            >
              {item.subtitle}
            </div>
            <p
              ref={descRef}
              className={`mt-4 text-sm leading-relaxed sm:text-base ${t.subText}`}
            >
              {item.description}
            </p>

            <div className={`mt-7 flex flex-wrap items-center gap-3 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
              <span
                ref={buttonRef}
                className={`inline-flex items-center rounded-md border px-5 py-3 text-sm font-bold tracking-wide ${t.button}`}
              >
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

  const cardElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const imageElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const overlayElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const gradientElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const contentElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const pillElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const titleElsRef = useRef<Array<HTMLHeadingElement | null>>([]);
  const subtitleElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const descElsRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const buttonElsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (!list.length) return;

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return;
    }

    let obs: IntersectionObserver | null = null;
    let disconnected = false;

    const runObserver = async () => {
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 50));
      if (disconnected) return;

      const containerEls = contentElsRef.current.filter(Boolean) as HTMLDivElement[];
      if (!containerEls.length) return;

      try {
        const mod: any = await import('gsap');
        const gsap = mod?.gsap || mod?.default || mod;
        if (!gsap) return;

        // Initialize all elements as hidden with modern effects
        containerEls.forEach((containerEl, idx) => {
          const dir = containerEl.getAttribute('data-anim-dir') === 'right' ? 1 : -1;
          
          // Card container animation
          const card = cardElsRef.current[idx];
          const image = imageElsRef.current[idx];
          const overlay = overlayElsRef.current[idx];
          const gradient = gradientElsRef.current[idx];
          
          if (card) {
            gsap.set(card, {
              opacity: 0,
              scale: 0.92,
              y: 40,
            });
          }
          
          if (image) {
            gsap.set(image, {
              scale: 1.15,
            });
            // Image içindeki img elementini animasyonlu yap
            const imgEl = image.querySelector('img');
            if (imgEl) {
              gsap.set(imgEl, {
                scale: 1.15,
                opacity: 0.7,
              });
            }
          }
          
          if (overlay) {
            gsap.set(overlay, {
              opacity: 0,
            });
          }
          
          if (gradient) {
            gsap.set(gradient, {
              opacity: 0,
            });
          }
          
          // Container animation (smooth entrance)
          gsap.set(containerEl, {
            opacity: 0,
            x: 60 * dir,
            y: 20,
            scale: 0.95,
            filter: 'blur(8px)',
          });

          // Individual text elements with stagger-ready setup
          const pill = pillElsRef.current[idx];
          const title = titleElsRef.current[idx];
          const subtitle = subtitleElsRef.current[idx];
          const desc = descElsRef.current[idx];
          const button = buttonElsRef.current[idx];

          if (pill) {
            gsap.set(pill, {
              opacity: 0,
              y: 20,
              scale: 0.8,
              filter: 'blur(4px)',
            });
          }
          if (title) {
            gsap.set(title, {
              opacity: 0,
              y: 30,
              scale: 0.9,
              filter: 'blur(6px)',
            });
          }
          if (subtitle) {
            gsap.set(subtitle, {
              opacity: 0,
              y: 25,
              scale: 0.92,
              filter: 'blur(5px)',
            });
          }
          if (desc) {
            gsap.set(desc, {
              opacity: 0,
              y: 20,
              scale: 0.95,
              filter: 'blur(4px)',
            });
          }
          if (button) {
            gsap.set(button, {
              opacity: 0,
              y: 15,
              scale: 0.85,
              filter: 'blur(3px)',
            });
          }
        });

        obs = new IntersectionObserver(
          (entries) => {
            if (disconnected) return;
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const containerEl = entry.target as HTMLDivElement;
              const idx = Array.from(containerEls).indexOf(containerEl);
              if (idx === -1) continue;

              const dir = containerEl.getAttribute('data-anim-dir') === 'right' ? 1 : -1;
              
              // Get individual elements
              const pill = pillElsRef.current[idx];
              const title = titleElsRef.current[idx];
              const subtitle = subtitleElsRef.current[idx];
              const desc = descElsRef.current[idx];
              const button = buttonElsRef.current[idx];

              // Get card elements
              const card = cardElsRef.current[idx];
              const image = imageElsRef.current[idx];
              const overlay = overlayElsRef.current[idx];
              const gradient = gradientElsRef.current[idx];
              
              // Create timeline for smooth sequential animation
              const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
              });

              // Card entrance animation (first - the whole card slides in)
              if (card) {
                tl.to(card, {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 1.0,
                  ease: 'power3.out',
                });
              }
              
              // Background image zoom effect
              if (image) {
                tl.to(
                  image,
                  {
                    scale: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                  },
                  '-=0.8'
                );
                // Image içindeki img elementini animasyonlu yap
                const imgEl = image.querySelector('img');
                if (imgEl) {
                  tl.to(
                    imgEl,
                    {
                      scale: 1,
                      opacity: 1,
                      duration: 1.2,
                      ease: 'power2.out',
                    },
                    '-=1.2'
                  );
                }
              }
              
              // Overlay fade in
              if (overlay) {
                tl.to(
                  overlay,
                  {
                    opacity: 1,
                    duration: 0.8,
                  },
                  '-=1.0'
                );
              }
              
              // Gradient fade in
              if (gradient) {
                tl.to(
                  gradient,
                  {
                    opacity: 1,
                    duration: 0.8,
                  },
                  '-=0.8'
                );
              }

              // Container/content entrance (smooth)
              tl.to(containerEl, {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.9,
              }, '-=0.5');

              // Stagger text elements with modern effects
              if (pill) {
                tl.to(
                  pill,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                  },
                  '-=0.7'
                );
              }

              if (title) {
                tl.to(
                  title,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.75,
                  },
                  '-=0.5'
                );
              }

              if (subtitle) {
                tl.to(
                  subtitle,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.65,
                  },
                  '-=0.4'
                );
              }

              if (desc) {
                tl.to(
                  desc,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.7,
                  },
                  '-=0.3'
                );
              }

              if (button) {
                tl.to(
                  button,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'back.out(1.2)',
                  },
                  '-=0.2'
                );
              }

              obs?.unobserve(containerEl);
            }
          },
          { threshold: 0.4, rootMargin: '0px 0px -25% 0px' }
        );

        for (const el of containerEls) obs.observe(el);
      } catch {
      }
    };

    runObserver();

    return () => {
      disconnected = true;
      obs?.disconnect();
    };
  }, [list]);

  if (!list.length) return null;

  return (
    <section className="w-full max-w-full overflow-hidden" aria-label="Dijital platformlar">
      <div className="mb-6">
        <h2 className="text-center text-xl font-extrabold tracking-wide text-slate-900 sm:text-2xl lg:text-3xl">
          {title}
        </h2>
      </div>

      <div className="w-full overflow-hidden rounded-3xl ring-1 ring-red-900/30">
        {list.map((item, idx) => {
          const align: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
          const animDir: 'left' | 'right' = align === 'left' ? 'left' : 'right';
          return (
            <div key={item.id}>
              {idx > 0 ? <div className="h-2 w-full bg-red-950" /> : null}
              <PlatformBlock
                item={item}
                align={align}
                cardRef={(el) => {
                  cardElsRef.current[idx] = el;
                }}
                imageRef={(el) => {
                  imageElsRef.current[idx] = el;
                }}
                overlayRef={(el) => {
                  overlayElsRef.current[idx] = el;
                }}
                gradientRef={(el) => {
                  gradientElsRef.current[idx] = el;
                }}
                contentRef={(el) => {
                  if (el) el.setAttribute('data-anim-dir', animDir);
                  contentElsRef.current[idx] = el;
                }}
                pillRef={(el) => {
                  pillElsRef.current[idx] = el;
                }}
                titleRef={(el) => {
                  titleElsRef.current[idx] = el;
                }}
                subtitleRef={(el) => {
                  subtitleElsRef.current[idx] = el;
                }}
                descRef={(el) => {
                  descElsRef.current[idx] = el;
                }}
                buttonRef={(el) => {
                  buttonElsRef.current[idx] = el;
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

