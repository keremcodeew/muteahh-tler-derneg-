import Link from 'next/link';

export function SiteFooter() {
  return (
    <div className="mt-14 w-full max-w-full overflow-hidden rounded-3xl bg-slate-900 px-4 py-10 text-white sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-white/90">Antalya İnşaat Müteahhitleri Derneği</p>
          <p className="mt-1 text-xs text-white/70">Antalya&apos;nın Geleceğini Güvenle İnşa Ediyoruz</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
            <Link href="/kvkk" className="hover:text-white">
              KVKK
            </Link>
            <Link href="/kullanim-sartlari" className="hover:text-white">
              Kullanım Şartları
            </Link>
            <Link href="/uyelik-sartlari" className="hover:text-white">
              Üyelik Şartları
            </Link>
            <Link href="/sms-geri-bildirim" className="hover:text-white">
              SMS ile Geri Bildirim
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/iletisim"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
          >
            İletişim
          </Link>
          <Link
            href="/uyelerimiz"
            className="rounded-full bg-burgundy px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
          >
            Üyelerimiz
          </Link>
        </div>
      </div>
    </div>
  );
}

