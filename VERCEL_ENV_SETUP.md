# Vercel Environment Variables Kurulum Rehberi

## Adım 1: Vercel Dashboard'a Gidin
1. https://vercel.com/dashboard
2. Projenizi seçin: `muteahh-tler-derneg-`
3. **Settings** → **Environment Variables** sekmesine gidin

## Adım 2: PostgreSQL Veritabanı Oluşturun (Henüz yoksa)
1. **Storage** sekmesine gidin
2. **Create Database** → **Postgres** seçin
3. Veritabanı oluşturulduktan sonra **.env.local** sekmesine tıklayın
4. Şu değişkenleri kopyalayın ve **Environment Variables**'a ekleyin:
   - `POSTGRES_URL_NON_POOLING` (ÖNEMLİ: Bu öncelikli kullanılır)
   - `POSTGRES_URL` (Alternatif)

**VEYA** harici PostgreSQL kullanıyorsanız:
- `DATABASE_URL` değişkenini ekleyin (postgres://... formatında)

## Adım 3: Environment Variables Ekleyin

Aşağıdaki değişkenleri **tek tek** ekleyin:

### Zorunlu Değişkenler:

| Key | Value | Açıklama |
|-----|-------|----------|
| `POSTGRES_URL_NON_POOLING` | `postgres://...` | Vercel Postgres'ten otomatik gelir |
| `JWT_SECRET` | `dcfb12f4d14c4536c61043ca24f824c62ea57fa2c0c0d6f3a2f5ec1c96910f1a471511aaf806fa12ecc3b92f1ba8260e32c4f3c8efb6b2ee658251f9356050f6` | JWT token şifreleme anahtarı |
| `ADMIN_EMAIL` | `softwareofuture@gmail.com` | Platform admin e-postası |
| `ADMIN_PASSWORD` | `MerveKerem1.0` | Platform admin şifresi |

### Frontend Değişkenleri (EmailJS):

| Key | Value | Açıklama |
|-----|-------|----------|
| `VITE_EMAILJS_SERVICE_ID` | `service_auetifa` | EmailJS servis ID |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_plzs4wc` | İletişim formu şablon ID |
| `VITE_EMAILJS_TEMPLATE_ID_RESET` | `template_t1mgfks` | Şifre sıfırlama şablon ID |
| `VITE_EMAILJS_PUBLIC_KEY` | `v2oS_ZPPLmDpsWyQR` | EmailJS public key |

## Adım 4: Environment Variables Ekleme Adımları

Her değişken için:
1. **Key** alanına değişken adını yazın (örn: `JWT_SECRET`)
2. **Value** alanına değeri yazın
3. **Environment** seçeneklerini işaretleyin:
   - ✅ **Production**
   - ✅ **Preview** 
   - ✅ **Development** (isteğe bağlı)
4. **Save** butonuna tıklayın
5. Bir sonraki değişken için tekrarlayın

## Adım 5: Deploy

Tüm değişkenler eklendikten sonra:
1. **Deployments** sekmesine gidin
2. Son deployment'ın yanındaki **⋯** menüsünden **Redeploy** seçin
3. Build tamamlanana kadar bekleyin

## Kontrol Listesi

- [ ] PostgreSQL veritabanı oluşturuldu
- [ ] `POSTGRES_URL_NON_POOLING` eklendi
- [ ] `JWT_SECRET` eklendi
- [ ] `ADMIN_EMAIL` eklendi
- [ ] `ADMIN_PASSWORD` eklendi
- [ ] `VITE_EMAILJS_SERVICE_ID` eklendi
- [ ] `VITE_EMAILJS_TEMPLATE_ID` eklendi
- [ ] `VITE_EMAILJS_TEMPLATE_ID_RESET` eklendi
- [ ] `VITE_EMAILJS_PUBLIC_KEY` eklendi
- [ ] Redeploy yapıldı

## Notlar

- **Production, Preview, Development**: Tüm environment'lar için aynı değerleri kullanabilirsiniz
- **Güvenlik**: `ADMIN_PASSWORD` ve `JWT_SECRET` gibi hassas bilgileri asla public repo'lara commit etmeyin
- **PostgreSQL**: Vercel Postgres kullanıyorsanız, `POSTGRES_URL_NON_POOLING` otomatik olarak eklenir
- **Build Hatası**: Eğer build sırasında `DATABASE_URL` hatası alırsanız, PostgreSQL veritabanını kontrol edin
