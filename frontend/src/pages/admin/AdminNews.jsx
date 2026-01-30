import { useState, useEffect } from 'react';
import { newsApi } from '../../api/client';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', imageUrl: '', publishDate: '', isPublished: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    newsApi.adminList(page, 10)
      .then((data) => {
        setItems(data.items);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const openCreate = () => {
    setForm({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      publishDate: new Date().toISOString().split('T')[0],
      isPublished: true,
    });
    setModal('create');
    setError('');
  };

  const openEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      imageUrl: item.imageUrl || '',
      publishDate: item.publishDate || '',
      isPublished: item.isPublished !== false,
    });
    setModal({ type: 'edit', id: item.id });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (modal === 'create') {
        await newsApi.create(form);
      } else {
        await newsApi.update(modal.id, form);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message || 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    try {
      await newsApi.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-serif text-2xl font-semibold text-dark-gray">Haberler</h2>
        <button type="button" onClick={openCreate} className="btn-primary shrink-0">+ Yeni Haber</button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-500">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">Henüz haber yok.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={item.imageUrl || PLACEHOLDER} alt="" className="w-16 h-10 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-dark-gray">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.publishDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => openEdit(item)} className="text-primary hover:underline text-sm mr-3">Düzenle</button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t flex justify-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Önceki</button>
              <span className="px-3 py-1 text-sm">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Sonraki</button>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold text-dark-gray">{modal === 'create' ? 'Yeni Haber' : 'Haberi Düzenle'}</h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                  <input type="text" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="input-field" placeholder="Kısa özet" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik *</label>
                  <textarea required rows={6} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="input-field resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                  <input type="url" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="input-field" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yayın Tarihi</label>
                    <input type="date" value={form.publishDate} onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))} className="input-field" />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">Yayında</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                  <button type="button" onClick={() => setModal(null)} className="btn-secondary">İptal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
