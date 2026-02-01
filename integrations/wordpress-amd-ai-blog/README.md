## AMD AI Blog Scheduler (WordPress Plugin)

Bu klasör, **WordPress sitelerde** başlık + tarih/saat girerek **Google AI Studio (Gemini) ile otomatik blog yazısı üretip yayınlayan** basit bir plugin örneğidir.

### Kurulum

1) `integrations/wordpress-amd-ai-blog/amd-ai-blog/` klasörünü zipleyin:
   - Zip içinde en üstte `amd-ai-blog/amd-ai-blog.php` olmalı.
2) WordPress Admin → Plugins → Add New → Upload Plugin → zip dosyasını yükleyin.
3) Etkinleştirin.

### Ayarlar

WordPress Admin menüsünde **AMD AI Blog** sayfasından:

- Google AI Studio (Gemini) API Key
- Model (varsayılan `gemini-1.5-flash`)

### Zamanlama

İş ekledikten sonra plugin, WP Cron ile **5 dakikada bir** due işleri kontrol eder ve blog post üretir.

Not: WP Cron, trafik geldikçe tetiklenir. Trafiği düşük sitelerde gerçek cron kullanmak daha sağlıklıdır.

