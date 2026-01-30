import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../api/client';
import { announcementsApi } from '../api/client';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
];

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomePage() {
  const [sliderItems, setSliderItems] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    Promise.all([
      newsApi.slider().catch(() => []),
      announcementsApi.recent().catch(() => []),
      announcementsApi.upcoming().catch(() => []),
    ]).then(([news, recent, upcoming]) => {
      setSliderItems(Array.isArray(news) ? news : []);
      setRecentAnnouncements(Array.isArray(recent) ? recent : []);
      setUpcomingEvents(Array.isArray(upcoming) ? upcoming : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (sliderItems.length <= 1) return;
    const t = setInterval(() => setCurrentSlide((s) => (s + 1) % sliderItems.length), 5000);
    return () => clearInterval(t);
  }, [sliderItems.length]);

  const displaySlides = sliderItems.length
    ? sliderItems.map((item, i) => ({
        id: item.id,
        type: 'news',
        title: item.title,
        excerpt: item.excerpt || item.content?.slice(0, 120),
        imageUrl: item.imageUrl || HERO_IMAGES[i % HERO_IMAGES.length],
        date: item.publishDate,
      }))
    : [
        { id: 1, type: 'news', title: 'Derneğimizden Haberler', excerpt: 'Sektördeki gelişmeler ve dernek faaliyetleri hakkında güncel bilgiler.', imageUrl: HERO_IMAGES[0], date: new Date().toISOString().split('T')[0] },
        { id: 2, type: 'news', title: 'Kalite ve Güven', excerpt: 'İnşaat sektöründe kalite standartları ve güvenilir iş ortaklıkları.', imageUrl: HERO_IMAGES[1], date: new Date().toISOString().split('T')[0] },
      ];

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-corp aspect-[16/10] bg-dark-gray">
              {displaySlides.length > 0 && (
                <>
                  {displaySlides.map((slide, i) => (
                    <Link
                      key={slide.id}
                      to={slide.type === 'news' ? `/news/${slide.id}` : `/announcements/${slide.id}`}
                      className={`absolute inset-0 block transition-opacity duration-500 ${
                        i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={slide.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className="text-sm opacity-90">{formatDate(slide.date)}</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-semibold mt-1">{slide.title}</h2>
                        {slide.excerpt && (
                          <p className="mt-2 text-sm md:text-base text-gray-200 line-clamp-2">{slide.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                  {displaySlides.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                      {displaySlides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => { e.preventDefault(); setCurrentSlide(i); }}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            i === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                          }`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
              {loading && displaySlides.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white">Yükleniyor...</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/register"
              className="card flex flex-col p-6 group hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-dark-gray mt-3">Üyelik Başvurusu</h3>
              <p className="text-sm text-gray-600 mt-1">Derneğimize üye olmak için başvuru yapın.</p>
              <span className="mt-3 text-primary font-medium text-sm group-hover:underline">Başvur &rarr;</span>
            </Link>

            <div className="card p-6">
              <h3 className="font-serif text-lg font-semibold text-dark-gray flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">D</span>
                Son Duyurular
              </h3>
              <ul className="mt-4 space-y-3">
                {recentAnnouncements.length === 0 && !loading && (
                  <li className="text-sm text-gray-500">Henüz duyuru yok.</li>
                )}
                {recentAnnouncements.slice(0, 3).map((a) => (
                  <li key={a.id}>
                    <Link to={`/announcements/${a.id}`} className="text-sm text-gray-700 hover:text-primary transition-colors line-clamp-2">
                      {a.title}
                    </Link>
                    <span className="text-xs text-gray-400">{formatDate(a.publishDate)}</span>
                  </li>
                ))}
              </ul>
              <Link to="/announcements" className="mt-3 text-sm font-medium text-primary hover:underline">
                Tümü →
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="font-serif text-lg font-semibold text-dark-gray flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">E</span>
                Yaklaşan Etkinlikler
              </h3>
              <ul className="mt-4 space-y-3">
                {upcomingEvents.length === 0 && !loading && (
                  <li className="text-sm text-gray-500">Yaklaşan etkinlik yok.</li>
                )}
                {upcomingEvents.slice(0, 3).map((e) => (
                  <li key={e.id}>
                    <Link to={`/announcements/${e.id}`} className="text-sm text-gray-700 hover:text-primary transition-colors line-clamp-2">
                      {e.title}
                    </Link>
                    <span className="text-xs text-gray-400">{formatDate(e.eventDate)}</span>
                  </li>
                ))}
              </ul>
              <Link to="/announcements" className="mt-3 text-sm font-medium text-primary hover:underline">
                Tümü →
              </Link>
            </div>

            <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="font-serif text-lg font-semibold text-dark-gray">Bülten</h3>
              <p className="text-sm text-gray-600 mt-1">Haber ve duyurulardan haberdar olun.</p>
              <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="input-field flex-1 text-sm py-2"
                />
                <button type="submit" className="btn-primary py-2 px-4 text-sm shrink-0">
                  Abone Ol
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-dark-gray">Neden Müteahhitler Derneği?</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Sektördeki güvenilir iş ortaklıkları, eğitim ve danışmanlık hizmetleriyle yanınızdayız.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
            {[
              { title: 'Kalite', desc: 'Standartlara uygun, güvenilir hizmet anlayışı', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Dayanışma', desc: 'Üyeler arası bilgi paylaşımı ve iş birliği', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { title: 'Gelişim', desc: 'Eğitim ve sertifikasyon destekleri', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-left">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-dark-gray mt-3">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
