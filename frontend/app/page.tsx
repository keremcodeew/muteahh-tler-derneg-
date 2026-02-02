'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { HeroSlider } from '../components/HeroSlider';
import { HomeBannerStrip } from '../components/HomeBannerStrip';
import { NewsCard } from '../components/NewsCard';
import { DigitalPlatformsSlider } from '../components/DigitalPlatformsSlider';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { LogoSlider } from '../components/LogoSlider';
import { SiteFooter } from '../components/SiteFooter';
import type { NewsItem, PartnerLogo, SliderItem, VideoItem } from '../lib/types';
import {
  listBannersPublic,
  listNewsPublic,
  listPartnersPublic,
  listPublicationsRecent,
  listSlidesPublic,
  listVideosRecent,
  type HomeBanner,
  type Publication,
} from '../lib/api';

export default function HomePage() {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoPreview, setVideoPreview] = useState<{ url: string; title: string } | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

  const formatDot = useMemo(() => {
    return (iso: string | null | undefined) => {
      if (!iso) return '';
      // YYYY-MM-DD -> DD.MM.YYYY
      const parts = String(iso).split('-');
      if (parts.length !== 3) return String(iso);
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const fetchWithRetry = async <T,>(fn: () => Promise<T>, retries = 2) => {
          let lastErr: any = null;
          for (let i = 0; i <= retries; i++) {
            try {
              return await fn();
            } catch (e) {
              lastErr = e;
              await sleep(400 + i * 600);
            }
          }
          throw lastErr;
        };

        // Batch requests to reduce simultaneous serverless DB connections (helps avoid intermittent 500s).
        const r1 = await Promise.allSettled([
          fetchWithRetry(() => listSlidesPublic({ limit: 8 }), 1),
          fetchWithRetry(() => listBannersPublic({ limit: 10 }), 2),
          fetchWithRetry(() => listNewsPublic({ page: 1, limit: 6 }), 1),
        ]);
        if (cancelled) return;

        const r2 = await Promise.allSettled([
          fetchWithRetry(() => listVideosRecent({ limit: 3 }), 1),
          fetchWithRetry(() => listPublicationsRecent({ limit: 3 }), 1),
          fetchWithRetry(() => listPartnersPublic({ limit: 50 }), 1),
        ]);
        if (cancelled) return;

        const slides = r1[0].status === 'fulfilled' ? r1[0].value : null;
        const bannersRes = r1[1].status === 'fulfilled' ? r1[1].value : null;
        const news = r1[2].status === 'fulfilled' ? r1[2].value : null;

        const vids = r2[0].status === 'fulfilled' ? r2[0].value : null;
        const pubs = r2[1].status === 'fulfilled' ? r2[1].value : null;
        const partners = r2[2].status === 'fulfilled' ? r2[2].value : null;

        if (Array.isArray(slides) && slides.length) {
          setSliderItems(
            slides.map((s) => ({
              id: String(s.id),
              date: s.dateText || '',
              title: s.title,
              description: s.description || '',
              imageUrl: s.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
              href: s.href || '#',
            }))
          );
        } else {
          setSliderItems([]);
        }
        setSlidesLoading(false);

        if (Array.isArray(bannersRes) && bannersRes.length) setBanners(bannersRes);
        else setBanners([]);
        setBannerLoading(false);

        if (news?.items?.length) {
          setNewsItems(
            news.items.map((n) => ({
              id: String(n.id),
              title: n.title,
              excerpt: n.excerpt || '',
              date: formatDot(n.publishDate),
              imageUrl: n.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            }))
          );
        } else {
          setNewsItems([]);
        }
        setNewsLoading(false);

        if (Array.isArray(vids) && vids.length) {
          setVideoItems(
            vids.map((v) => ({
              id: String(v.id),
              title: v.title,
              excerpt: v.excerpt || '',
              date: formatDot(v.publishDate),
              thumbnailUrl: v.thumbnailUrl || 'https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=1200&q=80',
              href: v.href || '#',
            }))
          );
        } else {
          setVideoItems([]);
        }
        setVideosLoading(false);

        if (Array.isArray(pubs) && pubs.length) {
          setPublications(pubs);
        } else {
          setPublications([]);
        }

        if (Array.isArray(partners)) {
          setPartnerLogos(
            partners.map((p) => ({
              id: String(p.id),
              name: p.title,
              logoText: p.logoText || p.title,
            }))
          );
        } else {
          setPartnerLogos([]);
        }
        setPartnersLoading(false);
      } catch {
        // Do not show dummy content on errors.
        setSliderItems([]);
        setNewsItems([]);
        setVideoItems([]);
        setPartnerLogos([]);
        setPublications([]);
        setSlidesLoading(false);
        setBannerLoading(false);
        setNewsLoading(false);
        setVideosLoading(false);
        setPartnersLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [formatDot]);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {slidesLoading ? (
          <section className="relative w-full overflow-hidden rounded-3xl bg-soft-gray shadow-card">
            <div className="h-[300px] animate-pulse sm:h-[360px] md:h-[460px] lg:h-[520px]" />
          </section>
        ) : (
          <HeroSlider items={sliderItems} />
        )}
        <div className="mt-5">
          <HomeBannerStrip banners={banners} loading={bannerLoading} />
        </div>

        <section className="mt-8 w-full sm:mt-10">
          <div className="grid w-full grid-cols-1 gap-8 lg:gap-10">
            <div className="space-y-10 sm:space-y-12">
              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Güncel Haberler</h2>
                  <Link href="/haberler" className="text-xs font-semibold text-burgundy hover:text-burgundy-dark sm:text-sm">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {newsItems.slice(0, 6).map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
                {!newsLoading && newsItems.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
                    Henüz haber eklenmemiş.
                  </div>
                ) : null}
              </div>

              <DigitalPlatformsSlider title="AMD DİJİTAL PLATFORMLAR" />

              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Video Arşiv</h2>
                  <Link href="/videolar" className="text-xs font-semibold text-burgundy hover:text-burgundy-dark sm:text-sm">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {videoItems.slice(0, 3).map((item) => (
                    <VideoCard
                      key={item.id}
                      item={item}
                      onOpen={(it) => {
                        if (!it.href || it.href === '#') return;
                        setVideoPreview({ url: it.href, title: it.title });
                      }}
                    />
                  ))}
                </div>
                {!videosLoading && videoItems.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
                    Henüz video eklenmemiş.
                  </div>
                ) : null}
              </div>

              <div className="w-full rounded-3xl bg-white p-4 shadow-card sm:p-5">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Yayınlar</h2>
                  <Link href="/yayinlar" className="text-xs font-semibold text-burgundy hover:text-burgundy-dark sm:text-sm">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {(publications.length ? publications : []).slice(0, 4).map((p) => (
                    <a
                      key={p.id}
                      href={p.fileUrl || '#'}
                      className="rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-800 transition-colors hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{p.title}</div>
                          <div className="mt-1 text-xs text-slate-500">{formatDot(p.publishDate)}</div>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-burgundy">İndir →</span>
                      </div>
                    </a>
                  ))}

                  {publications.length === 0 ? (
                    <div className="rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
                      Yayın bulunamadı.
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Üyelikler / Partnerler</h2>
                </div>

                <LogoSlider logos={partnerLogos} />
                {!partnersLoading && partnerLogos.length === 0 ? (
                  <div className="mt-4 rounded-3xl border border-black/5 bg-soft-gray px-4 py-3 text-sm text-slate-600">
                    Henüz partner eklenmemiş.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <VideoPlayerModal
          open={!!videoPreview}
          url={videoPreview?.url ?? null}
          title={videoPreview?.title}
          onClose={() => setVideoPreview(null)}
        />

        <SiteFooter />
      </main>
    </div>
  );
}

