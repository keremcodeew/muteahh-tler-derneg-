import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../api/client';
import { announcementsApi } from '../api/client';
import {
  heroData,
  fallbackProjects,
  testimonial,
  aboutData,
} from '../data/homePageData';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80';
const AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [newsForProjects, setNewsForProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      announcementsApi.list(1, 3).catch(() => ({ items: [] })),
      newsApi.list(1, 3).catch(() => ({ items: [] })),
    ]).then(([annData, newsData]) => {
      setAnnouncements(annData.items || []);
      setNewsForProjects(newsData.items || []);
      setLoading(false);
    });
  }, []);

  const projects = newsForProjects.length >= 2
    ? newsForProjects.slice(0, 2).map((n) => ({
        id: n.id,
        title: n.title,
        image: n.imageUrl || PLACEHOLDER,
      }))
    : fallbackProjects.slice(0, 2).map((p) => ({ id: p.id, title: p.title, image: p.image || PLACEHOLDER }));

  const displayAnnouncements = announcements.length >= 2
    ? announcements.slice(0, 2).map((a) => ({
        id: a.id,
        title: a.title,
        description: a.excerpt || a.content?.slice(0, 100),
        date: formatDate(a.publishDate),
        image: a.imageUrl || PLACEHOLDER,
      }))
    : [
        { id: 1, title: '2025 Yılı Genel Kurul Toplantısı', description: 'Derneğimizin yıllık olağan genel kurul toplantısı gerçekleştirilecektir.', date: '30.01.2025', image: PLACEHOLDER },
        { id: 2, title: 'İnşaat Sektörü Semineri', description: 'Kalite standartları ve güncel mevzuat değişiklikleri hakkında bilgilendirme semineri.', date: '28.01.2025', image: PLACEHOLDER },
      ];

  return (
    <div>
      {/* HeroSection - metin solda, icon üstte */}
      <section className="relative min-h-[380px] md:min-h-[450px] lg:min-h-[520px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 to-navy/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col justify-center min-h-[380px] md:min-h-[450px] lg:min-h-[520px]">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 32 32">
                <path d="M16 2L4 8v6l12 6 12-6V8L16 2zm0 2.5L22 8l-6 3.5L10 8l6-3.5zM6 9.5l4 2v4L6 13.5v-4zm20 0v4l-4 2v-4l4-2zM16 14l-4 2v4l4 2 4-2v-4l-4-2zM8 22l8 4 8-4v-2l-8 4-8-4v2z"/>
              </svg>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg mb-1">
              Antalya Müteahhitler Derneği
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 font-medium drop-shadow">
              Şehri Geleceğe Taşıyoruz
            </p>
          </div>
        </div>
      </section>

      {/* 3 Sütun: Duyurular | Projeler | Üyelik + Testimonial */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Sol: Güncel Duyurular */}
            <div id="duyurular">
              <h2 className="flex items-center gap-2 text-dark-gray font-semibold text-sm uppercase tracking-wider mb-6">
                <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Güncel Duyurular
              </h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="card p-4 animate-pulse flex gap-4">
                      <div className="w-20 h-20 rounded bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  ))
                ) : (
                  displayAnnouncements.map((a) => (
                    <Link key={a.id} to={announcements.length >= 2 ? `/announcements/${a.id}` : '/announcements'} className="card p-4 flex gap-4 hover:shadow-corp-hover transition-shadow block">
                      <img src={a.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500">{a.date}</span>
                        <h3 className="font-semibold text-navy mt-0.5 line-clamp-2">{a.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Orta: Projelerimiz */}
            <div id="projeler">
              <h2 className="text-dark-gray font-semibold text-sm uppercase tracking-wider mb-6">Projelerimiz</h2>
              <div className="space-y-4">
                {projects.map((p) => (
                  <Link key={p.id} to={newsForProjects.length >= 2 ? `/news/${p.id}` : '/news'} className="card block overflow-hidden hover:shadow-corp-hover transition-shadow">
                    <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-navy">{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/news" className="inline-flex items-center justify-center px-6 py-3 bg-sky-light text-navy font-semibold rounded-lg hover:bg-sky-200 transition-colors">
                  Tüm Projeler
                </Link>
              </div>
            </div>

            {/* Sağ: Üyelik CTA + Testimonial */}
            <div id="uyelik" className="space-y-4">
              <Link to="/register" className="card p-6 block hover:shadow-corp-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-sky-light flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <h3 className="font-bold text-navy text-lg mb-1">Hemen Üye Ol</h3>
                <p className="text-sm text-gray-600">Üyelik Avantajları</p>
              </Link>
              <div className="card p-5">
                <img src={AVATAR} alt="" className="w-14 h-14 rounded-full object-cover mx-auto mb-3" />
                <p className="text-sm text-gray-600 italic text-center mb-3 line-clamp-3">"{testimonial.quote}"</p>
                <p className="text-sm font-semibold text-navy text-center">{testimonial.author}</p>
                <p className="text-xs text-gray-500 text-center">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkımızda - görsel sol, metin sağ */}
      <section id="hakkimizda" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-corp">
              <img src={aboutData.image} alt={aboutData.title} className="w-full aspect-[4/3] object-cover" />
            </div>
            <div>
              <h2 className="text-dark-gray font-semibold text-sm uppercase tracking-wider mb-4">Hakkımızda</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{aboutData.description}</p>
              <Link to="/members" className="inline-flex items-center justify-center px-6 py-3 bg-sky-light text-navy font-semibold rounded-lg hover:bg-sky-200 transition-colors">
                Devamını Oku
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
