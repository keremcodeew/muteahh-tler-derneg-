import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';

export default function KullanimSartlariPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="Kullanım Şartları" subtitle="Web sitesinin kullanımına ilişkin kurallar." />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <div className="prose max-w-none prose-slate">
          <p>
            Bu web sitesi Antalya Müteahhitler Derneği tarafından işletilmektedir. Siteyi kullanarak aşağıdaki şartları kabul etmiş
            sayılırsınız.
          </p>

          <h2>1) Site İçeriği</h2>
          <p>Haberler, duyurular, yayınlar ve kurumsal içerikler bilgilendirme amaçlıdır.</p>

          <h2>2) Fikri Mülkiyet</h2>
          <p>Site içeriği; izinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.</p>

          <h2>3) Uygunsuz Kullanım</h2>
          <p>Hukuka aykırı kullanım, spam, güvenlik ihlali teşebbüsü ve kötüye kullanım yasaktır.</p>

          <h2>4) Sorumluluğun Sınırlandırılması</h2>
          <p>
            Dernek; sitedeki bilgilerin güncelliği için makul çabayı gösterir, ancak oluşabilecek doğrudan/dolaylı zararlardan mevzuatın
            izin verdiği ölçüde sorumlu değildir.
          </p>

          <h2>5) Değişiklik</h2>
          <p>Şartlar güncellenebilir. Güncel metin bu sayfada yayımlanır.</p>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

