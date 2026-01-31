'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { HeroSlider } from '../components/HeroSlider';
import { Sidebar } from '../components/Sidebar';
import { NewsCard } from '../components/NewsCard';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { VideoCard } from '../components/VideoCard';
import { LogoSlider } from '../components/LogoSlider';
import { SiteFooter } from '../components/SiteFooter';
import type { AnnouncementItem, EventItem, NewsItem, PartnerLogo, SliderItem, VideoItem } from '../lib/dummyData';
import {
  announcements as dummyAnnouncements,
  events as dummyEvents,
  newsItems as dummyNews,
  partnerLogos as dummyPartners,
  sliderItems as dummySlides,
  videoItems as dummyVideos,
} from '../lib/dummyData';
import {
  listAnnouncementsRecent,
  listEventsUpcoming,
  listNewsPublic,
  listPartnersPublic,
  listPublicationsRecent,
  listSlidesPublic,
  listVideosRecent,
  type Publication,
} from '../lib/api';

export default function HomePage() {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>(dummySlides);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(dummyNews);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(dummyAnnouncements);
  const [videoItems, setVideoItems] = useState<VideoItem[]>(dummyVideos);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [events, setEvents] = useState<EventItem[]>(dummyEvents);
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>(dummyPartners);

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
        const [slides, news, anns, vids, pubs, upcoming, partners] = await Promise.all([
          listSlidesPublic({ limit: 8 }),
          listNewsPublic({ page: 1, limit: 6 }),
          listAnnouncementsRecent(),
          listVideosRecent({ limit: 3 }),
          listPublicationsRecent({ limit: 3 }),
          listEventsUpcoming({ limit: 5 }),
          listPartnersPublic({ limit: 50 }),
        ]);
        if (cancelled) return;

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
        }

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
        }

        if (Array.isArray(anns) && anns.length) {
          setAnnouncements(
            anns.map((a) => ({
              id: String(a.id),
              code: a.code || `AMD-${String(a.publishDate || '').slice(0, 4) || '2026'}-${a.id}`,
              date: formatDot(a.publishDate),
              title: a.title,
            }))
          );
        }

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
        }

        if (Array.isArray(pubs) && pubs.length) {
          setPublications(pubs);
        }

        if (Array.isArray(upcoming)) {
          setEvents(
            upcoming.map((e) => ({
              id: String(e.id),
              title: e.title,
              date: e.dateText || (e.eventDate ? formatDot(e.eventDate) : ''),
              location: e.location || '',
              color: (e.color as any) || 'burgundy',
            }))
          );
        }

        if (Array.isArray(partners)) {
          setPartnerLogos(
            partners.map((p) => ({
              id: String(p.id),
              name: p.title,
              logoText: p.logoText || p.title,
            }))
          );
        }
      } catch {
        // Keep dummy content on any error (static layout remains unchanged)
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
        {/* HERO / SLIDER */}
        <HeroSlider items={sliderItems} />

        {/* Content + Sidebar (desktop) */}
        <section className="mt-10 w-full">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            {/* Main content */}
            <div className="space-y-12">
              {/* Güncel Haberler */}
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Güncel Haberler</h2>
                  <Link href="/haberler" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {newsItems.slice(0, 6).map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Güncel Duyurular */}
              <div className="w-full rounded-3xl bg-soft-gray p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Güncel Duyurular</h2>
                    <Link href="/duyurular" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {announcements.slice(0, 4).map((item) => (
                    <AnnouncementCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Video Arşiv */}
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Video Arşiv</h2>
                  <Link href="/videolar" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {videoItems.slice(0, 3).map((item) => (
                    <VideoCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Yayınlar */}
              <div className="w-full rounded-3xl bg-white p-4 shadow-card sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Yayınlar</h2>
                  <Link href="/yayinlar" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
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

              {/* Üyelikler / Partner Logoları */}
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Üyelikler / Partnerler</h2>
                  <Link href="#" className="text-sm font-semibold text-burgundy hover:text-burgundy-dark">
                    Tümünü Gör →
                  </Link>
                </div>

                <LogoSlider logos={partnerLogos} />
              </div>
            </div>

            {/* Sidebar (desktop sticky) - mobile'da aşağı iner */}
            <div>
              <div className="lg:sticky lg:top-24">
                <Sidebar events={events} />
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

