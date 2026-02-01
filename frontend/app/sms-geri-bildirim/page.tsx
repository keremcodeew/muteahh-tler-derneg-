'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { createSmsFeedback } from '../../lib/api';

const COUNTRY_CODES: Array<{ code: string; label: string }> = [
  { code: '+90', label: 'TR (+90)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+31', label: 'NL (+31)' },
  { code: '+7', label: 'RU/KZ (+7)' },
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
];

export default function SmsGeriBildirimPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(COUNTRY_CODES[0]?.code || '+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageLayoutWithFooter>
      <PageHero title="SMS ile Geri Bildirim" subtitle="Geri bildiriminizi bize iletin. İncelenip dönüş yapılacaktır." />

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Geri Bildirim Formu</h2>
          <p className="mt-1 text-sm text-slate-600">İsterseniz dönüş için iletişim bilgilerinizi bırakabilirsiniz.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              const pn = phoneNumber.replace(/\D/g, '');
              if (!phoneCountryCode || !/^\+\d{1,4}$/.test(phoneCountryCode)) {
                setError('Lütfen geçerli bir ülke kodu seçin.');
                return;
              }
              if (!pn || pn.length < 4 || pn.length > 15) {
                setError('Lütfen geçerli bir telefon numarası girin.');
                return;
              }
              if (!message.trim() || message.trim().length < 5) {
                setError('Lütfen mesajınızı yazın.');
                return;
              }

              setLoading(true);
              try {
                await createSmsFeedback({
                  phoneE164: `${phoneCountryCode}${pn}`,
                  message: message.trim(),
                  name: name.trim() ? name.trim() : undefined,
                  email: email.trim() ? email.trim() : undefined,
                });
                router.push('/sms-geri-bildirim/basarili');
              } catch (err: any) {
                setError(err?.message ?? 'Geri bildirim gönderilemedi.');
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label htmlFor="sms_name" className="text-sm font-semibold text-slate-700">
                Ad Soyad (opsiyonel)
              </label>
              <input
                id="sms_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
              />
            </div>

            <div>
              <label htmlFor="sms_email" className="text-sm font-semibold text-slate-700">
                E-posta (opsiyonel)
              </label>
              <input
                id="sms_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Telefon</label>
              <div className="mt-2 grid grid-cols-[140px_1fr] gap-3">
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
            </div>

            <div>
              <label htmlFor="sms_message" className="text-sm font-semibold text-slate-700">
                Mesaj
              </label>
              <textarea
                id="sms_message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="mt-2 w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="Geri bildiriminizi yazın…"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Gönderiliyor…' : 'Geri Bildirim Gönder'}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-soft-gray p-6">
          <h3 className="text-sm font-bold text-slate-900">Bilgi</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Bu form üzerinden iletilen kayıtlar veritabanına kaydedilir.</li>
            <li>• Geri dönüş için telefon/e-posta bilgileriniz kullanılabilir.</li>
            <li>• Kişisel verileriniz için KVKK metnini inceleyebilirsiniz.</li>
          </ul>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

