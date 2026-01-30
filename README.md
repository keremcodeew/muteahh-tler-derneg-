# Müteahhitler Derneği — Kurumsal Web Sitesi

"Müteahhitler Derneği" için React arayüzü, Node/Express REST API, SQLite (varsayılan) veya PostgreSQL, JWT kimlik doğrulama ve EmailJS ile iletişim formu içeren tam yığın (full-stack) kurumsal web sitesi.

## Kullanılan Teknolojiler

- **Ön yüz:** React 18, Tailwind CSS, React Router 6, EmailJS
- **Arka uç:** Node.js, Express.js, Sequelize
- **Veritabanı:** Varsayılan **SQLite** (kurulum yok, tek dosya). İsteğe bağlı PostgreSQL.
- **Kimlik doğrulama:** JWT (giriş, kayıt, rol tabanlı admin)

## Hızlı Başlangıç (Kurulum Gerektirmez)

**PostgreSQL veya pgAdmin kurmana gerek yok.** Varsayılan olarak SQLite kullanılır; veritabanı dosyası (`backend/database.sqlite`) ilk çalıştırmada otomatik oluşur.

### 1. Arka Uç (Backend)

Proje klasöründe (mt) şunları çalıştır:

```bash
cd backend
copy .env.example .env
npm install
npm run seed:admin
npm run dev
```

- **Windows’ta** `copy` kullan; Linux/macOS’ta `cp .env.example .env`.
- `.env` dosyasında sadece **JWT_SECRET** değiştirmen yeterli (istersen); veritabanı için ek ayar gerekmez.
- İlk çalıştırmada `database.sqlite` oluşur ve admin kullanıcı eklenir.

Arka uç **http://localhost:5000** adresinde çalışır.

**Varsayılan admin (seed sonrası):**  
- E-posta: `admin@muteahhitler.org`  
- Şifre: `Admin123!`  
`.env` içinde `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ile değiştirebilirsin.

### 2. Ön Yüz (Frontend)

Yeni bir terminal açıp:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

- Windows’ta `copy`; Linux/macOS’ta `cp .env.example .env`.
- İletişim formu için isteğe bağlı: `.env` içinde `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` ekle.

Ön yüz **http://localhost:3000** adresinde çalışır ve `/api` isteklerini arka uca yönlendirir.

## EmailJS (İletişim Formu)

1. [emailjs.com](https://www.emailjs.com/) adresinden kayıt olun.
2. Bir servis ve e-posta şablonu oluşturup Service ID, Template ID ve Public Key değerlerini alın.
3. `frontend/.env` dosyasında şunları tanımlayın:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

Şablonda kullanılan değişkenler: `from_name`, `from_email`, `message`, `to_email`.

## İsteğe bağlı: PostgreSQL (yerel)

PostgreSQL kullanmak istersen: PostgreSQL’i kur, `muteahhitler_dernegi` veritabanını oluştur, `backend/.env` içine `DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/muteahhitler_dernegi` ekle. Uygulama otomatik olarak PostgreSQL’e bağlanır; yoksa SQLite kullanmaya devam eder.

## Vercel’e deploy (veritabanı dahil)

Proje Vercel’de çalışacak şekilde ayarlı: hem frontend hem API aynı domainde, veritabanı için **hosted PostgreSQL** kullanılır (Vercel’de SQLite kullanılamaz).

**1. Veritabanı (PostgreSQL)**  
Vercel’de bir PostgreSQL veritabanı ekle:

- **Vercel Postgres:** Proje → Storage → Create Database → Postgres. Oluşturduktan sonra **.env.local**’e ekle’deki değişkenleri kopyala.
- **Neon / Supabase:** [neon.tech](https://neon.tech) veya [supabase.com](https://supabase.com) üzerinden ücretsiz Postgres oluştur, bağlantı URL’sini al (örn. `postgresql://user:pass@host/db?sslmode=require`).

**2. Vercel ortam değişkenleri**  
Vercel projesinde Settings → Environment Variables’a ekle:

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | PostgreSQL bağlantı URL’si (Vercel Postgres veya Neon/Supabase) |
| `JWT_SECRET` | Güçlü bir gizli anahtar (örn. rastgele uzun bir string) |
| `ADMIN_EMAIL` | (İsteğe bağlı) Admin e-posta |
| `ADMIN_PASSWORD` | (İsteğe bağlı) Admin şifre |

**3. Deploy**  
Projeyi Vercel’e bağla (GitHub/GitLab/Bitbucket veya `vercel` CLI). Build sırasında `backend` içinde `npm run db:sync` çalışır ve tablolar oluşturulur. İlk deploy sonrası admin kullanıcı yoksa, yerelde bir kez `cd backend && npm run seed:admin` çalıştırıp aynı `DATABASE_URL` ile bağlanabilir veya Vercel’de “Redeploy” yapmadan önce ortam değişkenlerine `ADMIN_EMAIL` / `ADMIN_PASSWORD` ekleyip build’de seed çalışacak şekilde özelleştirebilirsin.

**Not:** `vercel.json` ile build sırasında `db:sync` ve frontend build tanımlı; `/api/*` istekleri `api/index.js` üzerinden Express’e gider. Frontend’in API adresi `/api` olduğu için aynı domainde çalışır.

## Proje Yapısı

```
mt/
├── backend/
│   ├── database.sqlite # SQLite kullanılıyorsa otomatik oluşur
│   ├── middleware/     # auth, adminOnly
│   ├── models/         # User, News, Announcement, Member
│   ├── routes/         # auth, news, announcements, members
│   ├── scripts/        # seed-admin
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/         # API istemcisi
│   │   ├── components/  # Layout, Header, Footer, AdminLayout
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Ana Sayfa, Haberler, Duyurular, Üyeler, İletişim, Giriş, Kayıt
│   │   └── pages/admin/ # Panel, Haber CRUD, Duyuru CRUD, Üye CRUD
│   └── index.html
└── README.md
```

## API Uç Noktaları

| Metot | Uç Nokta | Açıklama |
|--------|----------|----------|
| POST | /api/auth/register | Üye kaydı |
| POST | /api/auth/login | Giriş |
| GET | /api/auth/me | Giriş yapmış kullanıcı (token gerekli) |
| GET | /api/news | Haber listesi (herkese açık, sayfalı) |
| GET | /api/news/slider | Ana sayfa slider için son haberler |
| GET | /api/news/:id | Haber detayı |
| GET | /api/announcements | Duyuru listesi |
| GET | /api/announcements/recent | Ana sayfa için son duyurular |
| GET | /api/announcements/upcoming | Yaklaşan etkinlikler |
| GET | /api/announcements/:id | Duyuru detayı |
| GET | /api/members | Üye rehberi (onaylı üyeler, arama) |
| GET | /api/members/:id | Üye profili |

Sadece admin (Bearer token + admin rolü):

- GET/POST/PUT/DELETE `/api/news`, `/api/news/:id`, `/api/news/admin/all`
- GET/POST/PUT/DELETE `/api/announcements`, `/api/announcements/:id`, `/api/announcements/admin/all`
- GET/POST/PUT/DELETE `/api/members`, `/api/members/:id`, GET `/api/members/admin/all`

## Tasarım

- **Renkler:** Ana renk `#0B3D91`, beyaz, koyu gri `#2B2B2B`
- **Yazı tipleri:** Başlıklar için Playfair Display, gövde metni için Source Sans 3
- Masaüstü, tablet ve mobil için duyarlı (responsive) düzen

## Lisans

Özel / dahili kullanım.
