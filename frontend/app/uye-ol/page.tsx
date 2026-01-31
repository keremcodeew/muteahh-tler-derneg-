'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import { register, setToken } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

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
              setLoading(true);
              try {
                const res = await register({
                  name: name.trim(),
                  email: email.trim(),
                  password,
                  company: company.trim() ? company.trim() : undefined,
                  role: role.trim() ? role.trim() : undefined,
                });
                setToken(res.token);
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
              <label className="text-sm font-semibold text-slate-700">Firma (opsiyonel)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                placeholder="Firma adı"
              />
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
    </PageLayoutWithFooter>
  );
}

