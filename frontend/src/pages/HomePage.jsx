import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../api/client';
import { announcementsApi } from '../api/client';
import {
  heroData,
  sliderItems,
  fallbackProjects,
  fallbackEvents,
  aboutData,
} from '../data/homePageData';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=450&q=80';

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDateShort(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      announcementsApi.list(1, 5).catch(() => ({ items: [] })),
      newsApi.list(1, 6).catch(() => ({ items: [] })),
    ]).then(([annData, newsData]) => {
      setAnnouncements(annData.items || []);
      setNews(newsData.items || []);
      setLoading(false);
    });
  }, []);

  const sliderData = news.length >= 1
    ? news.slice(0, 3).map((n, i) => ({
        id: n.id,
        date: formatDate(n.publishDate),
        title: n.title,
        description: n.excerpt || n.content?.slice(0, 120) + '...',
        image: n.imageUrl || PLACEHOLDER,
        link: `/news/${n.id}`,
      }))
    : sliderItems;

  const sliderLen = sliderData.length || 1;
  useEffect(() => {
    if (sliderLen <= 1) return;
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % sliderLen), 6000);
    return () => clearInterval(t);
  }, [sliderLen]);

  const displayNews = news.length >= 3
    ? news.slice(0, 6).map((n) => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt || n.content?.slice(0, 100) + '...',
        date: formatDateShort(n.publishDate),
        image: n.imageUrl || PLACEHOLDER,
      }))
    : fallbackProjects.slice(0, 6).map((p, i) => ({
        id: p.id || i + 1,
        title: p.title,
        excerpt: p.description,
        date: '30.01.2025',
        image: p.image || PLACEHOLDER,
      }));

  const displayAnnouncements = announcements.length >= 1
    ? announcements.slice(0, 5).map((a) => ({
        id: a.id,
        code: `AMD-${a.id}`,
        date: formatDateShort(a.publishDate),
        title: a.title,
      }))
    : [
        { id: 1, code: 'AMD-2025-001', date: '30.01.2025', title: 'İnşaat Sektörü Analizi - Ocak 2025' },
        { id: 2, code: 'AMD-2025-002', date: '28.01.2025', title: 'Genel Kurul Toplantısı Duyurusu' },
        { id: 3, code: 'AMD-2025-003', date: '25.01.2025', title: 'Üye Kabul Süreci Başladı' },
      ];

  const events = fallbackEvents;

  const currentSlide = sliderData[slideIndex] || sliderData[0];

  return (
    <div>
      {/* Hero Slider - TMB tarzı */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[580px] overflow-hidden">
        {currentSlide && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
              style={{ backgroundImage: `url(${currentSlide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 md:pb-16">
                <p className="text-gold text-sm font-medium mb-2">{currentSlide.date}</p>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 max-w-3xl">
                  {currentSlide.title}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-4 max-w-2xl line-clamp-2">
                  {currentSlide.description}
                </p>
                <Link
                  to={currentSlide.link}
                  className="inline-flex items-center px-5 py-2.5 bg-gold text-navy font-semibold text-sm hover:bg-gold-light transition-colors"
                >
                  DETAYLI İNCELE
                </Link>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {sliderData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === slideIndex ? 'bg-gold' : 'bg-white/50'}`}
                  aria-label={`Slayt ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* İçerik alanı - TMB grid layout */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Güncel Haberler */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-navy font-bold text-lg">Güncel Haberler</h2>
                <Link to="/news" className="text-gold hover:text-gold-light font-semibold text-sm">
                  Tümünü Gör
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-video bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  displayNews.slice(0, 4).map((n) => (
                    <Link
                      key={n.id}
                      to={news.length >= 3 ? `/news/${n.id}` : '/news'}
                      className="group bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img src={n.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-navy group-hover:text-primary line-clamp-2 mb-1">{n.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{n.excerpt}</p>
                        <span className="text-xs text-gray-500">{n.date}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Sağ sütun: Duyurular + Etkinlikler */}
            <div className="space-y-8">
              {/* Güncel Duyurular - TMB liste stili */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-navy font-bold text-lg">Güncel Duyurular</h2>
                  <Link to="/announcements" className="text-gold hover:text-gold-light font-semibold text-sm">
                    Tümünü Gör
                  </Link>
                </div>
                <div className="space-y-2">
                  {displayAnnouncements.map((a) => (
                    <Link
                      key={a.id}
                      to={announcements.length >= 1 ? `/announcements/${a.id}` : '/announcements'}
                      className="flex items-start gap-3 p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <svg className="w-8 h-8 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">{a.code} • {a.date}</p>
                        <h3 className="font-medium text-navy group-hover:text-primary text-sm line-clamp-2">{a.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Etkinlikler */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-navy font-bold text-lg">Etkinlikler</h2>
                  <Link to="/announcements" className="text-gold hover:text-gold-light font-semibold text-sm">
                    Tümünü Gör
                  </Link>
                </div>
                <div className="space-y-3">
                  {events.map((e) => (
                    <div key={e.id} className="flex gap-3 p-3 bg-white rounded shadow-sm">
                      <div className="shrink-0 w-12 text-center">
                        <span className="block text-gold font-bold text-lg leading-tight">
                          {e.date.split(' ')[0]}
                        </span>
                        <span className="text-xs text-gray-500">{e.date.split(' ').slice(1).join(' ')}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-navy text-sm">{e.title}</h3>
                        <p className="text-xs text-gray-500">{e.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Üye Ol CTA + Hakkımızda */}
      <section id="hakkimizda" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={aboutData.image} alt={aboutData.title} className="w-full aspect-[4/3] object-cover" />
            </div>
            <div>
              <h2 className="text-navy font-bold text-xl mb-4">Kurumsal</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{aboutData.description}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/members" className="inline-flex items-center px-6 py-3 bg-navy text-white font-semibold hover:bg-primary transition-colors">
                  Üyelerimiz
                </Link>
                <Link to="/register" className="inline-flex items-center px-6 py-3 border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-navy transition-colors">
                  Üye Ol
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
