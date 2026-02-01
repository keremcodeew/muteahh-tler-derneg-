'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';
import {
  clearToken,
  documentDownloadUrl,
  getToken,
  listMyDocuments,
  me,
  uploadMyDocument,
  updateMyMember,
  type MemberDocument,
} from '../../lib/api';

type DocKey = 'contractor_license' | 'tax_certificate' | 'trade_registry';

function kindLabel(kind: string) {
  switch (kind) {
    case 'contractor_license':
      return 'Müteahhitlik Belgesi';
    case 'tax_certificate':
      return 'Vergi Levhası';
    case 'trade_registry':
      return 'Ticaret Sicil Gazetesi';
    default:
      return kind;
  }
}

async function fileToBase64(file: File) {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsDataURL(file);
  });
  return dataUrl.split(',')[1] || '';
}

export default function MyProfilePage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);

  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);
  const [docsInfo, setDocsInfo] = useState<null | { requiredKinds: string[]; verificationStatus: string; verificationNote: string | null; items: MemberDocument[] }>(null);
  const [uploadingKind, setUploadingKind] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    if (!t) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    me(t)
      .then((res) => {
        if (cancelled) return;
        setIsPlatformAdmin(res.user.role === 'platform_admin');
        if (res.member) {
          setName(res.member.name || '');
          setCompany(res.member.company || '');
          setRole(res.member.role || '');
          setProfileImageUrl(res.member.profileImageUrl || '');
        }
      })
      .catch((e: any) => {
        if (cancelled) return;
        clearToken();
        setTokenState(null);
        setError(e?.message ?? 'Oturum doğrulanamadı.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshDocs() {
    if (!token) return;
    setDocsLoading(true);
    setDocsError(null);
    try {
      const res = await listMyDocuments(token);
      setDocsInfo(res);
    } catch (e: any) {
      setDocsError(e?.message ?? 'Belgeler yüklenemedi.');
    } finally {
      setDocsLoading(false);
    }
  }

  return (
    <PageLayoutWithFooter>
      <PageHero title="Profilim" subtitle="Kişisel bilgilerinizi güncelleyebilirsiniz." />

      {!token ? (
        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Profilinizi görüntülemek için giriş yapmanız gerekiyor.{' '}
          <Link href="/login" className="font-semibold underline">
            Üye Girişi →
          </Link>
        </div>
      ) : loading ? (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card">Yükleniyor…</div>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-slate-900">Bilgilerim</h2>
            <p className="mt-1 text-sm text-slate-600">Bu bilgiler sadece sizin profiliniz içindir.</p>

            <form
              className="mt-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!token) return;
                setSaving(true);
                setOk(false);
                setError(null);
                try {
                  await updateMyMember(token, {
                    name: name.trim(),
                    company: company.trim() || null,
                    role: role.trim() || null,
                    profileImageUrl: profileImageUrl.trim() || null,
                  });
                  setOk(true);
                  setTimeout(() => setOk(false), 2200);
                } catch (err: any) {
                  setError(err?.message ?? 'Güncelleme başarısız.');
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div>
                <label htmlFor="profile_name" className="text-sm font-semibold text-slate-700">
                  Ad Soyad
                </label>
                <input
                  id="profile_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              <div>
                <label htmlFor="profile_company" className="text-sm font-semibold text-slate-700">
                  Firma
                </label>
                <input
                  id="profile_company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              <div>
                <label htmlFor="profile_role" className="text-sm font-semibold text-slate-700">
                  Üyelik / Rol
                </label>
                <input
                  id="profile_role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              <div>
                <label htmlFor="profile_image_url" className="text-sm font-semibold text-slate-700">
                  Profil Fotoğraf URL
                </label>
                <input
                  id="profile_image_url"
                  value={profileImageUrl}
                  onChange={(e) => setProfileImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}
              {ok ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Güncellendi.
                </div>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-burgundy-dark disabled:opacity-60"
              >
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            </form>

            <div className="mt-8 border-t border-black/5 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Belgelerim</h3>
                  <p className="mt-1 text-xs text-slate-600">Onay için belgelerinizi yükleyin / güncelleyin.</p>
                </div>
                <button
                  type="button"
                  onClick={refreshDocs}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Yenile
                </button>
              </div>

              {docsError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{docsError}</div>
              ) : null}

              {docsInfo?.verificationNote ? (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Not</div>
                  <div className="mt-1 text-sm">{docsInfo.verificationNote}</div>
                </div>
              ) : null}

              {docsLoading ? (
                <div className="mt-4 text-sm text-slate-600">Belgeler yükleniyor…</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {(['contractor_license', 'tax_certificate', 'trade_registry'] as DocKey[]).map((kind) => {
                    const doc = docsInfo?.items?.find((d) => d.kind === kind) || null;
                    return (
                      <div key={kind} className="rounded-3xl border border-black/5 bg-soft-gray p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900">{kindLabel(kind)}</div>
                            <div className="mt-1 text-xs text-slate-600">
                              Durum: <span className="font-semibold">{doc?.status || 'Yüklenmedi'}</span>
                            </div>
                            {doc?.reviewerNote ? <div className="mt-1 text-xs text-slate-600">Not: {doc.reviewerNote}</div> : null}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {doc ? (
                              <a
                                href={documentDownloadUrl(doc.id)}
                                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                İndir
                              </a>
                            ) : null}
                            <label
                              htmlFor={`upload_${kind}`}
                              className="cursor-pointer rounded-full bg-burgundy px-3 py-1.5 text-xs font-semibold text-white"
                            >
                              {doc ? 'Yeniden Yükle' : 'Yükle'}
                            </label>
                            <input
                              id={`upload_${kind}`}
                              type="file"
                              accept="application/pdf,image/png,image/jpeg"
                              className="hidden"
                              disabled={!token || uploadingKind === kind}
                              onChange={async (e) => {
                                const f = e.target.files?.[0] || null;
                                if (!f || !token) return;
                                setUploadingKind(kind);
                                setDocsError(null);
                                try {
                                  const base64 = await fileToBase64(f);
                                  await uploadMyDocument(token, { kind, filename: f.name, mimeType: f.type, base64 });
                                  await refreshDocs();
                                } catch (err2: any) {
                                  setDocsError(err2?.message ?? 'Belge yüklenemedi.');
                                } finally {
                                  setUploadingKind(null);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-soft-gray p-6">
            <h3 className="text-sm font-bold text-slate-900">Kısayollar</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Link href="/uyelerimiz" className="block font-semibold text-burgundy hover:text-burgundy-dark">
                Üye Dizini →
              </Link>
              {isPlatformAdmin ? (
                <Link href="/platform-admin" className="block font-semibold text-burgundy hover:text-burgundy-dark">
                  Platform Admin →
                </Link>
              ) : null}
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-soft-gray"
              onClick={() => {
                clearToken();
                setTokenState(null);
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </section>
      )}
    </PageLayoutWithFooter>
  );
}

