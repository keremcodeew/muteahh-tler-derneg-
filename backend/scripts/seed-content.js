require('dotenv').config();
const db = require('../models');

function isoFromDotDate(dot) {
  // "30.01.2026" -> "2026-01-30"
  const m = String(dot || '').match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return new Date().toISOString().split('T')[0];
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

async function seedMissingByKey(model, rows, name, getKey) {
  if (!rows.length) {
    console.log(`${name}: skip (no seed rows)`);
    return;
  }

  const existing = await model.findAll({ attributes: ['id', 'title', 'code'] }).catch(() => []);
  const existingKeys = new Set(
    (existing || [])
      .map((r) => {
        const any = r && typeof r.get === 'function' ? r.get({ plain: true }) : r;
        return getKey(any);
      })
      .filter(Boolean)
  );

  const toInsert = rows.filter((r) => {
    const k = getKey(r);
    return k && !existingKeys.has(k);
  });

  if (!toInsert.length) {
    console.log(`${name}: up-to-date`);
    return;
  }

  await model.bulkCreate(toInsert);
  console.log(`${name}: inserted ${toInsert.length} missing rows`);
}

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });

    // HERO SLIDER
    const slides = [
      {
        title: 'Yurt Dışı Müteahhitlik Hizmetleri Ödül Töreni',
        description: '“Dünyanın En Büyük 250 Uluslararası Müteahhidi” listesinde yer alan firmalar ödüllerini aldı.',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
        href: '#',
        dateText: '27 Ocak 2026',
        sortOrder: 1,
        isPublished: true,
      },
      {
        title: 'Ortadoğu ve Kuzey Afrika Bölgesi Bülteni Yayında',
        description: 'Üyelerimizin bölgesel gelişmeleri takip edebilmesi amacıyla yeni bülten yayınlandı.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
        href: '#',
        dateText: '28 Ocak 2026',
        sortOrder: 2,
        isPublished: true,
      },
      {
        title: 'Öne Çıkan Etkinlikler',
        description: 'Yüz yüze ve dijital platformlar üzerinden yürütülen etkinliklerden seçkiler.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
        href: '#',
        dateText: '05 Ocak 2026',
        sortOrder: 3,
        isPublished: true,
      },
    ];

    // NEWS
    const news = [
      {
        title: 'Sektör Buluşması Antalya’da Gerçekleştirildi',
        excerpt: 'Üyelerimiz ile bir araya gelerek 2026 hedeflerini değerlendirdik.',
        content:
          'Üyelerimiz ile bir araya gelerek 2026 hedeflerini değerlendirdik.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        publishDate: isoFromDotDate('30.01.2026'),
        isPublished: true,
      },
      {
        title: 'Yeni Dönem Eğitim Takvimi Yayında',
        excerpt: 'Sertifika programları ve mevzuat eğitimleri için başvurular açıldı.',
        content:
          'Sertifika programları ve mevzuat eğitimleri için başvurular açıldı.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
        publishDate: isoFromDotDate('27.01.2026'),
        isPublished: true,
      },
      {
        title: 'Kentsel Dönüşümde Güncel Yaklaşımlar',
        excerpt: 'Uzman konuşmacılarla düzenlenen panelde yeni uygulamalar ele alındı.',
        content:
          'Uzman konuşmacılarla düzenlenen panelde yeni uygulamalar ele alındı.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
        publishDate: isoFromDotDate('22.01.2026'),
        isPublished: true,
      },
      {
        title: 'Teknik Gezi: Şantiye Ziyareti',
        excerpt: 'Örnek proje sahasında iş güvenliği ve kalite süreçlerini inceledik.',
        content:
          'Örnek proje sahasında iş güvenliği ve kalite süreçlerini inceledik.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        publishDate: isoFromDotDate('15.01.2026'),
        isPublished: true,
      },
      {
        title: 'İhracat ve Yurt Dışı Projeler Çalıştayı',
        excerpt: 'Yeni pazar fırsatlarını değerlendirmek için çalışma grupları kuruldu.',
        content:
          'Yeni pazar fırsatlarını değerlendirmek için çalışma grupları kuruldu.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
        publishDate: isoFromDotDate('10.01.2026'),
        isPublished: true,
      },
      {
        title: 'Üyelerimize Özel Danışmanlık Hattı',
        excerpt: 'Mevzuat, sözleşme ve uygulama süreçleri için destek hizmeti başladı.',
        content:
          'Mevzuat, sözleşme ve uygulama süreçleri için destek hizmeti başladı.\n\nDetaylar yakında paylaşılacaktır.',
        imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80',
        publishDate: isoFromDotDate('05.01.2026'),
        isPublished: true,
      },
    ];

    // ANNOUNCEMENTS
    const announcements = [
      {
        code: 'AMD-2026-68',
        title: 'İnşaat Sektörü Analizi - Ocak 2026',
        excerpt: 'İnşaat Sektörü Analizi - Ocak 2026',
        content: 'İnşaat Sektörü Analizi - Ocak 2026\n\nDetaylar yakında paylaşılacaktır.',
        publishDate: isoFromDotDate('30.01.2026'),
        isPublished: true,
      },
      {
        code: 'AMD-2026-64',
        title: 'Ukrayna için Enerji Ekipmanları Destek Talebi',
        excerpt: 'Ukrayna için Enerji Ekipmanları Destek Talebi',
        content: 'Ukrayna için Enerji Ekipmanları Destek Talebi\n\nDetaylar yakında paylaşılacaktır.',
        publishDate: isoFromDotDate('30.01.2026'),
        isPublished: true,
      },
      {
        code: 'AMD-2026-66',
        title: 'Uluslararası Sulama Teknolojileri Fuarı Duyurusu',
        excerpt: 'Uluslararası Sulama Teknolojileri Fuarı Duyurusu',
        content: 'Uluslararası Sulama Teknolojileri Fuarı Duyurusu\n\nDetaylar yakında paylaşılacaktır.',
        publishDate: isoFromDotDate('29.01.2026'),
        isPublished: true,
      },
      {
        code: 'AMD-2026-60',
        title: 'Genel Kurul Toplantısı Bilgilendirmesi',
        excerpt: 'Genel Kurul Toplantısı Bilgilendirmesi',
        content: 'Genel Kurul Toplantısı Bilgilendirmesi\n\nDetaylar yakında paylaşılacaktır.',
        publishDate: isoFromDotDate('24.01.2026'),
        isPublished: true,
      },
    ];

    // VIDEOS
    const videos = [
      {
        title: 'Tanıtım Filmi',
        excerpt: 'Derneğimizin faaliyetlerini ve çalışmalarını anlatan kısa tanıtım videosu.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
        href: '#',
        publishDate: isoFromDotDate('18.09.2023'),
        isPublished: true,
      },
      {
        title: 'Etkinlikler Öne Çıkanlar',
        excerpt: 'Yılın öne çıkan etkinliklerinden kısa bir derleme.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
        href: '#',
        publishDate: isoFromDotDate('01.07.2025'),
        isPublished: true,
      },
      {
        title: 'Sektör Paneli',
        excerpt: 'Sektörün geleceği üzerine uzman görüşleri ve değerlendirmeler.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-aadb801c60ae?w=1200&q=80',
        href: '#',
        publishDate: isoFromDotDate('27.01.2026'),
        isPublished: true,
      },
    ];

    // PUBLICATIONS (basic defaults)
    const publications = [
      {
        title: 'AMD Faaliyet Raporu 2025',
        excerpt: 'Derneğimizin 2025 yılı faaliyetlerini içeren rapor.',
        coverImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
        fileUrl: '#',
        publishDate: isoFromDotDate('15.12.2025'),
        isPublished: true,
      },
      {
        title: 'Sektör Bülteni - Ocak 2026',
        excerpt: 'Aylık sektör bülteni ve öne çıkan gelişmeler.',
        coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
        fileUrl: '#',
        publishDate: isoFromDotDate('31.01.2026'),
        isPublished: true,
      },
      {
        title: 'Mevzuat Bilgilendirme Notu',
        excerpt: 'Güncel mevzuat değişiklikleri hakkında özet not.',
        coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
        fileUrl: '#',
        publishDate: isoFromDotDate('20.01.2026'),
        isPublished: true,
      },
    ];

    await seedMissingByKey(db.HeroSlide, slides, 'HeroSlide', (r) => String(r?.title || '').trim());
    await seedMissingByKey(db.News, news, 'News', (r) => String(r?.title || '').trim());
    await seedMissingByKey(
      db.Announcement,
      announcements,
      'Announcement',
      (r) => (String(r?.code || '').trim() ? String(r.code).trim() : String(r?.title || '').trim())
    );
    await seedMissingByKey(db.Video, videos, 'Video', (r) => String(r?.title || '').trim());
    await seedMissingByKey(db.Publication, publications, 'Publication', (r) => String(r?.title || '').trim());

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

