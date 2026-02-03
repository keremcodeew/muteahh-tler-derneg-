import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';

export default function KvkkPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="KVKK Aydınlatma Metni" subtitle="Kişisel verilerin işlenmesi hakkında bilgilendirme." />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <div className="prose max-w-none prose-slate">
          <p>
            Antalya İnşaat Müteahhitleri Derneği (“Dernek”) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında
            kişisel verilerinizin güvenliğine önem veriyoruz.
          </p>

          <h2>1) Veri Sorumlusu</h2>
          <p>Veri sorumlusu: Antalya İnşaat Müteahhitleri Derneği.</p>

          <h2>2) İşlenen Kişisel Veriler</h2>
          <ul>
            <li>Kimlik ve iletişim: ad soyad, e-posta, telefon</li>
            <li>Kurumsal: firma, ünvan/rol bilgileri</li>
            <li>Üyelik başvurusu: başvuru ve doğrulama belgeleri</li>
            <li>İşlem güvenliği: sistem logları ve güvenlik kayıtları</li>
          </ul>

          <h2>3) İşleme Amaçları</h2>
          <ul>
            <li>Üyelik başvurusu ve değerlendirme süreçlerinin yürütülmesi</li>
            <li>Belgelerin doğrulanması ve onay sürecinin yürütülmesi</li>
            <li>İletişim faaliyetlerinin yürütülmesi</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
          </ul>

          <h2>4) Hukuki Sebepler</h2>
          <p>KVKK m.5 ve m.6 kapsamında; açık rıza, sözleşmenin kurulması/ifası, hukuki yükümlülük ve meşru menfaat.</p>

          <h2>5) Aktarım</h2>
          <p>
            Kişisel verileriniz; mevzuat gereği yetkili kurumlarla ve hizmetin sunulması için gerekli olması halinde sınırlı olarak
            hizmet sağlayıcılarla paylaşılabilir.
          </p>

          <h2>6) Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, işleme amaçları ve ilgili mevzuat süreleri kadar saklanır; süre sonunda silinir, yok edilir veya anonim
            hale getirilir.
          </p>

          <h2>7) Haklarınız</h2>
          <p>
            KVKK m.11 kapsamında; bilgi talep etme, düzeltme, silme, aktarımları öğrenme ve işlemeye itiraz gibi haklara sahipsiniz.
          </p>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

