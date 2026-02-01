import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';

export default function UyelikSartlariPage() {
  return (
    <PageLayoutWithFooter>
      <PageHero title="Üyelik Şartları" subtitle="Üyelik başvurusu ve üyelik süreçlerine ilişkin koşullar." />

      <section className="mt-8 rounded-3xl bg-white p-6 shadow-card">
        <div className="prose max-w-none prose-slate">
          <p>
            Üyelik başvurusu; gerekli bilgilerin ve zorunlu belgelerin eksiksiz iletilmesiyle yapılır. Başvurunun kabulü platform
            yöneticisi değerlendirmesi ve onayı sonrasında gerçekleşir.
          </p>

          <h2>1) Başvuru ve Doğrulama</h2>
          <ul>
            <li>Üye adayı, doğru ve güncel bilgi vermekle yükümlüdür.</li>
            <li>Zorunlu belgeler (ör. müteahhitlik belgesi, vergi levhası, ticaret sicil gazetesi) doğrulama amacıyla istenir.</li>
            <li>Eksik/yanlış belge durumunda yeniden yükleme talep edilebilir veya başvuru reddedilebilir.</li>
          </ul>

          <h2>2) Üyelik Onayı</h2>
          <p>Üyelik, ancak gerekli belgeler platform yöneticisi tarafından incelenip onaylandıktan sonra aktif hale gelir.</p>

          <h2>3) Hesap Güvenliği</h2>
          <p>Şifre ve hesabın güvenliği üyeye aittir. Şüpheli kullanım tespitinde erişim kısıtlanabilir.</p>

          <h2>4) İletişim</h2>
          <p>Dernek, üyelik süreciyle ilgili bilgilendirme için e-posta/telefon kanallarıyla iletişim kurabilir.</p>

          <h2>5) Değişiklik</h2>
          <p>Üyelik şartları güncellenebilir. Güncel metin bu sayfada yayımlanır.</p>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

