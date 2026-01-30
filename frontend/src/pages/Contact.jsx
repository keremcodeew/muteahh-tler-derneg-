import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export default function Contact() {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: 'info@muteahhitler.org',
        }, PUBLIC_KEY);
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('demo');
        setForm({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setStatus('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-dark-gray">İletişim</h1>
        <p className="mt-2 text-gray-600">Bizimle iletişime geçin</p>
      </div>

      <div className="card p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {status === 'success' && (
            <div className="p-4 rounded-lg bg-green-50 text-green-800 text-sm border border-green-200">
              Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
            </div>
          )}
          {status === 'demo' && (
            <div className="p-4 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-200">
              Demo modu: EmailJS yapılandırılmadı. .env dosyasına VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID ve VITE_EMAILJS_PUBLIC_KEY ekleyin.
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              Mesaj gönderilemedi. Lütfen tekrar deneyin veya doğrudan e-posta ile iletişime geçin.
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesaj *</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Mesajınızı yazın..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>

      <div className="mt-10 p-6 rounded-xl bg-light-gray border border-gray-200">
        <h3 className="font-serif font-semibold text-dark-gray">Doğrudan İletişim</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li><strong>Adres:</strong> Örnek Mah. İnşaat Cad. No:1, İstanbul</li>
          <li><strong>Tel:</strong> +90 212 000 00 00</li>
          <li><strong>E-posta:</strong> info@muteahhitler.org</li>
        </ul>
      </div>
    </div>
  );
}
