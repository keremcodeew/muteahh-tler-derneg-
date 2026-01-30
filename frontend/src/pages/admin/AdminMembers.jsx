import { useState, useEffect } from 'react';
import { membersApi } from '../../api/client';

const AVATAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminMembers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', company: '', role: '', profileImageUrl: '', joinDate: '', isApproved: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    membersApi.adminList(page)
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
      name: '', email: '', company: '', role: '', profileImageUrl: '', joinDate: new Date().toISOString().split('T')[0], isApproved: true,
    });
    setModal('create');
    setError('');
  };

  const openEdit = (item) => {
    setForm({
      name: item.name,
      email: item.email,
      company: item.company || '',
      role: item.role || '',
      profileImageUrl: item.profileImageUrl || '',
      joinDate: item.joinDate || '',
      isApproved: item.isApproved !== false,
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
        await membersApi.create(form);
      } else {
        await membersApi.update(modal.id, form);
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
    if (!confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return;
    try {
      await membersApi.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-serif text-2xl font-semibold text-dark-gray">Üyeler</h2>
        <button type="button" onClick={openCreate} className="btn-primary shrink-0">+ Yeni Üye</button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-gray-500">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">Henüz üye yok.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Üye</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Firma</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Üyelik</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Onay</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.profileImageUrl || AVATAR_PLACEHOLDER} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-dark-gray">{item.name}</p>
                          {item.role && <p className="text-xs text-gray-500">{item.role}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.company || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.joinDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${item.isApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {item.isApproved ? 'Onaylı' : 'Beklemede'}
                      </span>
                    </td>
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
              <h3 className="font-serif text-xl font-semibold text-dark-gray">{modal === 'create' ? 'Yeni Üye' : 'Üyeyi Düzenle'}</h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
                    <input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol / Unvan</label>
                    <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profil Görsel URL</label>
                  <input type="url" value={form.profileImageUrl} onChange={(e) => setForm((f) => ({ ...f, profileImageUrl: e.target.value }))} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Üyelik Tarihi</label>
                    <input type="date" value={form.joinDate} onChange={(e) => setForm((f) => ({ ...f, joinDate: e.target.value }))} className="input-field" />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isApproved} onChange={(e) => setForm((f) => ({ ...f, isApproved: e.target.checked }))} className="rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-700">Onaylı (dizinde görünsün)</span>
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
