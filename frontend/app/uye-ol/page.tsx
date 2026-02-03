'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { register, setToken, uploadMyDocument } from '../../lib/api';

type DocKey = 'contractor_license' | 'tax_certificate' | 'trade_registry';

function acceptHint() {
  return 'application/pdf,image/png,image/jpeg';
}

function kindLabel(kind: DocKey) {
  switch (kind) {
    case 'contractor_license':
      return 'Müteahhitlik Belgesi (Zorunlu)';
    case 'tax_certificate':
      return 'Vergi Levhası (Zorunlu)';
    case 'trade_registry':
      return 'Ticaret Sicil Gazetesi (Zorunlu)';
  }
}

async function fileToBase64(file: File) {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsDataURL(file);
  });
  const base64 = dataUrl.split(',')[1] || '';
  return base64;
}

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: '+90', label: 'TR (+90)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+31', label: 'NL (+31)' },
  { code: '+7', label: 'RU/KZ (+7)' },
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
];

type LegalDocKey = 'kvkk' | 'terms';

function legalTitle(k: LegalDocKey) {
  return k === 'kvkk' ? 'KVKK Aydınlatma Metni' : 'Kullanım ve Üyelik Şartları';
}

function legalText(k: LegalDocKey) {
  if (k === 'kvkk') {
    return `
Antalya İnşaat Müteahhitleri Derneği (“Dernek”) olarak kişisel verilerinizin güvenliği konusunda azami hassasiyet göstermekteyiz.

1) Veri sorumlusu: Antalya İnşaat Müteahhitleri Derneği.
2) Toplanan veriler: Ad soyad, e-posta, telefon, firma/ünvan bilgileri, üyelik başvuru belgeleri ve site kullanımına ilişkin kayıtlar.
3) Amaç: Üyelik başvurusu alınması, değerlendirilmesi, doğrulama sürecinin yürütülmesi, üyelik işlemlerinin yürütülmesi, iletişim faaliyetleri ve dernek faaliyetlerinin yürütülmesi.
4) Hukuki sebepler: KVKK m.5 ve m.6 kapsamında; açık rıza, sözleşmenin kurulması/ifası, hukuki yükümlülük, meşru menfaat.
5) Aktarım: Yasal yükümlülükler kapsamında yetkili kurumlarla, ayrıca hizmet sağlayıcılarla (barındırma/altyapı) sınırlı olmak üzere paylaşım yapılabilir.
6) Saklama: Amaç ve mevzuat süreleri kadar saklanır, sonra silinir/yok edilir/anonim hale getirilir.
7) Haklarınız: KVKK m.11 kapsamında; bilgi talebi, düzeltme, silme, işlemeye itiraz, aktarım bilgisini öğrenme vb. haklara sahipsiniz.

Bu metin bilgilendirme amaçlıdır. Başvuru sırasında ilettiğiniz belgeler ve bilgiler, üyelik doğrulama sürecinin yürütülmesi için kullanılacaktır.
    `.trim();
  }

  return `
Kullanım ve Üyelik Şartları (“Şartlar”) – Antalya İnşaat Müteahhitleri Derneği

1) Amaç: Bu site; dernek duyuruları, haberler, yayınlar ve üyelik başvuru/üyelik paneli hizmetlerini sunar.
2) Üyelik başvurusu: Başvuru, gerekli bilgilerin ve zorunlu belgelerin yüklenmesiyle yapılır. Başvurunun kabulü platform yöneticisi onayına tabidir.
3) Doğruluk: Başvuru sırasında verilen bilgi ve belgelerin doğru ve güncel olması başvuru sahibinin sorumluluğundadır.
4) Hesap güvenliği: Şifrenizi gizli tutmak ve hesabınız üzerinden yapılan işlemlerden sorumlu olmak size aittir.
5) İçerik kullanımı: Site içeriği; izinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.
6) Uygunsuz kullanım: Hukuka aykırı kullanım, sahte bilgi/belge, spam ve kötüye kullanım durumlarında başvuru reddedilebilir veya üyelik askıya alınabilir.
7) İletişim: Dernek, üyelik ve doğrulama süreciyle ilgili sizinle e-posta/telefon kanallarıyla iletişime geçebilir.
8) Değişiklik: Şartlar güncellenebilir. Güncel metin web sitesinde yayımlanır.

Bu Şartlar’ı okuduğunuzu ve kabul ettiğinizi beyan edersiniz.
  `.trim();
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(COUNTRY_CODES[0]?.code || '+90');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [docs, setDocs] = useState<Record<DocKey, File | null>>({
    contractor_license: null,
    tax_certificate: null,
    trade_registry: null,
  });

  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kvkkRead, setKvkkRead] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [legalOpen, setLegalOpen] = useState<null | LegalDocKey>(null);
  const [legalScrolledEnd, setLegalScrolledEnd] = useState(false);
  const legalScrollRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordMismatch = useMemo(() => {
    if (!password || !password2) return false;
    return password !== password2;
  }, [password, password2]);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Üye Kayıt" subtitle="Üyelik başvurunuzu oluşturun. Başvurunuz platform yöneticisi tarafından onaylandıktan sonra görünür." />

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Başvuru Formu</h2>
          <p className="mt-1 text-sm text-slate-600">Bilgilerinizi girin ve üyeliği oluşturun.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (passwordMismatch) {
                setError('Şifreler eşleşmiyor.');
                return;
              }

              const pn = phoneNumber.replace(/\D/g, '');
              if (!phoneCountryCode || !/^\+\d{1,4}$/.test(phoneCountryCode)) {
                setError('Lütfen geçerli bir ülke kodu seçin.');
                return;
              }
              if (!pn || pn.length < 4 || pn.length > 15) {
                setError('Lütfen geçerli bir telefon numarası girin.');
                return;
              }

              if (!kvkkAccepted || !termsAccepted) {
                setError('Devam etmek için KVKK ve kullanım/üyelik şartlarını kabul etmelisiniz.');
                return;
              }

              const requiredKinds: DocKey[] = ['contractor_license', 'tax_certificate', 'trade_registry'];
              const missing = requiredKinds.filter((k) => !docs[k]);
              if (missing.length) {
                setError('Lütfen zorunlu belgeleri yükleyin.');
                return;
              }

              setLoading(true);
              try {
                const res = await register({
                  name: name.trim(),
                  email: email.trim(),
                  password,
                  company: company.trim() ? company.trim() : undefined,
                  role: role.trim() ? role.trim() : undefined,
                  websiteUrl: websiteUrl.trim() ? websiteUrl.trim() : undefined,
                  phoneCountryCode,
                  phoneNumber: pn,
                  kvkkAccepted: true,
                  termsAccepted: true,
                });
                setToken(res.token);

                // Upload required documents right after registration
                for (const kind of requiredKinds) {
                  const f = docs[kind]!;
                  const base64 = await fileToBase64(f);
                  await uploadMyDocument(res.token, { kind, filename: f.name, mimeType: f.type, base64 });
                }

                router.push('/profilim');
              } catch (err: any) {
                setError(err?.message ?? 'Kayıt başarısız.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="text-sm font-semibold text-slate-700">Ad Soyad</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="Ad Soyad"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Telefon</label>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                  aria-label="Ülke kodu"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  inputMode="numeric"
                  required
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                  placeholder="Telefon numarası"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Sadece rakam girin (boşluk/işaret olmadan).</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Firma (opsiyonel)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="Firma adı"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Web Sitesi (opsiyonel)</label>
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="https://firma.com"
              />
              <p className="mt-1 text-xs text-slate-500">Üyeler sayfasında firmanın üstüne tıklanınca bu adres açılır.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Ünvan / Rol (opsiyonel)</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="Örn. Yönetici / Mühendis"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Şifre</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                minLength={6}
                required
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Şifre (Tekrar)</label>
              <input
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type="password"
                minLength={6}
                required
                className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-colors ${
                  passwordMismatch ? 'border-red-300 focus:border-red-500' : 'border-black/10 focus:border-burgundy'
                }`}
                placeholder="Şifreyi tekrar yazın"
              />
            </div>

            <div className="rounded-3xl border border-black/5 bg-soft-gray p-4">
              <h3 className="text-sm font-bold text-slate-900">Belge Yükleme</h3>
              <p className="mt-1 text-xs text-slate-600">
                Başvurunuzun onaylanabilmesi için belgeler zorunludur. PDF/JPG/PNG kabul edilir.
              </p>

              <div className="mt-4 space-y-3">
                {(['contractor_license', 'tax_certificate', 'trade_registry'] as DocKey[]).map((k) => (
                  <div key={k}>
                    <label htmlFor={`doc_${k}`} className="text-xs font-semibold text-slate-700">
                      {kindLabel(k)}
                    </label>
                    <input
                      id={`doc_${k}`}
                      type="file"
                      accept={acceptHint()}
                      required
                      className="mt-2 block w-full text-sm"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setDocs((s) => ({ ...s, [k]: f }));
                      }}
                    />
                    <p className="mt-1 text-xs text-slate-500">{docs[k]?.name || 'Dosya seçilmedi.'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-soft-gray p-4">
              <h3 className="text-sm font-bold text-slate-900">KVKK ve Şartlar</h3>
              <p className="mt-1 text-xs text-slate-600">
                İşaretlemeden önce metinleri görüntüleyip tamamen okumanız gerekir.
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setLegalScrolledEnd(false);
                      setLegalOpen('kvkk');
                      setTimeout(() => {
                        if (legalScrollRef.current) legalScrollRef.current.scrollTop = 0;
                      }, 0);
                    }}
                  >
                    KVKK Metnini Oku
                  </button>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={kvkkAccepted}
                      disabled={!kvkkRead}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                    />
                    KVKK Aydınlatma Metni’ni okudum ve kabul ediyorum.
                  </label>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setLegalScrolledEnd(false);
                      setLegalOpen('terms');
                      setTimeout(() => {
                        if (legalScrollRef.current) legalScrollRef.current.scrollTop = 0;
                      }, 0);
                    }}
                  >
                    Kullanım ve Üyelik Şartlarını Oku
                  </button>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      disabled={!termsRead}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    Kullanım ve Üyelik Şartları’nı okudum ve kabul ediyorum.
                  </label>
                </div>

                <div className="text-xs text-slate-500">
                  Sayfalar:{" "}
                  <Link href="/kvkk" className="font-semibold text-burgundy hover:underline">
                    KVKK
                  </Link>
                  {" • "}
                  <Link href="/kullanim-sartlari" className="font-semibold text-burgundy hover:underline">
                    Kullanım Şartları
                  </Link>
                  {" • "}
                  <Link href="/uyelik-sartlari" className="font-semibold text-burgundy hover:underline">
                    Üyelik Şartları
                  </Link>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Kayıt yapılıyor…' : 'Üyelik Oluştur'}
            </button>

            <div className="pt-2 text-sm text-slate-600">
              Zaten hesabın var mı?{' '}
              <Link href="/login" className="font-semibold text-burgundy hover:underline">
                Giriş yap
              </Link>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-soft-gray p-6">
          <h3 className="text-sm font-bold text-slate-900">Bilgi</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Kayıt sonrası üyelik “Onay Bekliyor” durumunda olur.</li>
            <li>• Platform yöneticisi onayladıktan sonra “Üyelerimiz” sayfasında görünür.</li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">Not: Giriş yaptıktan sonra “Profilim” ekranından bilgilerinizi güncelleyebilirsiniz.</p>
        </div>
      </section>

      {legalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 px-6 py-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">{legalTitle(legalOpen)}</div>
                <div className="mt-1 text-xs text-slate-500">Aşağı kaydırıp metnin sonuna gelmeden onaylayamazsınız.</div>
              </div>
              <button
                type="button"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setLegalOpen(null)}
              >
                Kapat
              </button>
            </div>

            <div
              ref={legalScrollRef}
              className="max-h-[60vh] overflow-y-auto px-6 py-4"
              onScroll={(e) => {
                const el = e.currentTarget;
                const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
                if (atEnd) setLegalScrolledEnd(true);
              }}
            >
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{legalText(legalOpen)}</pre>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                İsterseniz ayrı sayfadan da okuyabilirsiniz:{" "}
                {legalOpen === 'kvkk' ? (
                  <Link href="/kvkk" className="font-semibold text-burgundy hover:underline">
                    KVKK sayfası
                  </Link>
                ) : (
                  <>
                    <Link href="/kullanim-sartlari" className="font-semibold text-burgundy hover:underline">
                      Kullanım Şartları
                    </Link>
                    {" • "}
                    <Link href="/uyelik-sartlari" className="font-semibold text-burgundy hover:underline">
                      Üyelik Şartları
                    </Link>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={!legalScrolledEnd}
                className="rounded-full bg-burgundy px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  if (legalOpen === 'kvkk') {
                    setKvkkRead(true);
                    setKvkkAccepted(true);
                  } else {
                    setTermsRead(true);
                    setTermsAccepted(true);
                  }
                  setLegalOpen(null);
                }}
              >
                Okudum ve Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageLayoutWithFooter>
  );
}

