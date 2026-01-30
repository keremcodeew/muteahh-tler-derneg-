# Vercel’e Yükleme ve PostgreSQL Kurma

Projeyi Vercel’e yükleyip orada PostgreSQL kullanmak için aşağıdaki adımları uygula.

---

## 1. Projeyi Git’e at (henüz yoksa)

Proje klasöründe (`mt`) terminal aç:

```bash
git init
git add .
git commit -m "İki commit"
```

GitHub’da yeni bir boş repo oluştur (örn. `muteahhitler-dernegi`), sonra:

```bash
git remote add origin https://github.com/KULLANICI_ADIN/repo-adin.git
git branch -M main
git push -u origin main
```

(KULLANICI_ADIN ve repo-adin kendi bilgilerinle değiştir. **Dikkat:** URL tek olmalı, örn. `https://github.com/kerem-wo/muteahhitler-dernegi.git` — içinde ikinci kez `https://github.com/...` geçmemeli.)

---

## 2. Vercel’e giriş ve proje ekleme

1. [vercel.com](https://vercel.com) adresine git, **Sign Up** / **Log In** (GitHub ile giriş yapabilirsin).
2. **Add New…** → **Project**.
3. **Import Git Repository** bölümünde GitHub repo’nu seç (örn. `muteahhitler-dernegi`).
4. **Import**’a tıkla.

---

## 3. Vercel’de PostgreSQL kurma

1. Proje sayfasında üstte **Storage** sekmesine gir.
2. **Create Database**’e tıkla.
3. **Postgres**’i seç → **Continue**.
4. Veritabanı adı (örn. `muteahhitler-db`) yazıp **Create**’e tıkla.
5. Açılan pencerede **Connect Project** (veya **.env.local’e ekle**) kısmında bu projeyi seç.
6. **Connect**’e tıkla.  
   Böylece Vercel, projeye `POSTGRES_URL` (ve gerekirse diğer Postgres değişkenlerini) otomatik ekler.

---

## 4. Ortam değişkenlerini kontrol et

1. Vercel projesinde **Settings** → **Environment Variables**.
2. Şunların olduğundan emin ol (Postgres bağlantısı Storage’dan gelmiş olabilir):

| Değişken         | Değer / Açıklama |
|------------------|------------------|
| `POSTGRES_URL`   | Storage’dan otomatik gelir (Postgres bağlantı URL’si). |
| `JWT_SECRET`     | Kendi belirlediğin uzun, rastgele bir string (örn. `benim-gizli-jwt-anahtarim-123`). |
| `ADMIN_EMAIL`    | İsteğe bağlı: Admin giriş e-postası (örn. `admin@muteahhitler.org`). |
| `ADMIN_PASSWORD` | İsteğe bağlı: Admin şifresi (örn. `Admin123!`). |

`POSTGRES_URL` yoksa Storage’da veritabanına tıklayıp **Connection string** veya **Env vars** kısmından kopyalayıp **Environment Variables**’a **POSTGRES_URL** adıyla ekle.  
**Save**’e bas.

---

## 5. Deploy’u başlat

1. **Deployments** sekmesine dön.
2. **Redeploy** veya ilk kez ise **Deploy**’a tıkla.
3. Build bittiğinde **Visit** ile siteyi aç.

Build sırasında:

- `backend` içinde `db:sync` çalışır → Postgres’te tablolar oluşur.
- `seed:admin` çalışır → Admin kullanıcı oluşur (ADMIN_EMAIL / ADMIN_PASSWORD tanımlıysa).
- Frontend build alınır.

---

## 6. Siteyi test et

- Ana sayfa: `https://proje-adin.vercel.app`
- Admin giriş: `https://proje-adin.vercel.app/login`  
  E-posta: `ADMIN_EMAIL` (veya `admin@muteahhitler.org`), Şifre: `ADMIN_PASSWORD` (veya `Admin123!`).

---

## Sorun çıkarsa

- **Build hatası:** **Deployments** → ilgili deployment → **Building** log’una bak. Genelde `POSTGRES_URL` / `JWT_SECRET` eksikse veya `backend` / `frontend` `npm install` hata veriyorsa görünür.
- **API 500 / veritabanı hatası:** **Settings** → **Environment Variables**’da `POSTGRES_URL` doğru mu, Storage’da veritabanı “Connected” mı kontrol et.
- **Admin giriş olmuyor:** `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ekleyip **Redeploy** yap; build’de `seed:admin` tekrar çalışır.

Bu adımlarla proje Vercel’de çalışır ve veritabanı orada kurduğun PostgreSQL olur.
