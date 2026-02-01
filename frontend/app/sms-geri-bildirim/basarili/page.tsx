import Link from 'next/link';
import { PageHero } from '../../../components/PageHero';
import { PageLayoutWithFooter } from '../../../components/PageLayout';

export default function SmsGeriBildirimBasariliPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="Teşekkürler" subtitle="Geri bildiriminiz alındı." />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm text-slate-700">
          Kaydınız başarıyla oluşturuldu. En kısa sürede incelenip tarafınıza dönüş yapılacaktır.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-burgundy px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-burgundy-dark"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/sms-geri-bildirim"
            className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Yeni Geri Bildirim
          </Link>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

