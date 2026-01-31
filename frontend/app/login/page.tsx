'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { login, setToken } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageLayoutWithFooter>
      <PageHero title="Üye Girişi" subtitle="Üye paneline giriş yapın." />

      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Giriş</h2>
          <p className="mt-1 text-sm text-slate-600">E-posta ve şifrenizle giriş yapın.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              try {
                const res = await login(email.trim(), password);
                setToken(res.token);
                router.push('/profilim');
              } catch (err: any) {
                setError(err?.message ?? 'Giriş başarısız.');
              } finally {
                setLoading(false);
              }
            }}
          >
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
              <label className="text-sm font-semibold text-slate-700">Şifre</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="••••••••"
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
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
              <Link href="/uye-ol" className="font-semibold text-burgundy hover:underline">
                Üye Kayıt (Üye Ol)
              </Link>
              <span className="text-slate-500">Kayıt sonrası onay gerekir.</span>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-soft-gray p-6">
          <h3 className="text-sm font-bold text-slate-900">Bilgi</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Üyelik kaydı sonrası onay süreci vardır.</li>
            <li>• Onay için platform yöneticisi paneli kullanılır.</li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">Not: Şifre yenileme akışı backend’de hazırdır.</p>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

