import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../api/client';
import { announcementsApi } from '../../api/client';
import { membersApi } from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news: 0, announcements: 0, members: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      newsApi.adminList(1, 1).then((d) => d.total).catch(() => 0),
      announcementsApi.adminList(1, 1).then((d) => d.total).catch(() => 0),
      membersApi.adminList(1).then((d) => d.total).catch(() => 0),
    ]).then(([news, announcements, members]) => {
      setStats({ news, announcements, members });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="animate-pulse text-gray-500">Yükleniyor...</div>;
  }

  const cards = [
    { label: 'Haberler', value: stats.news, to: '/admin/news', color: 'primary' },
    { label: 'Duyurular', value: stats.announcements, to: '/admin/announcements', color: 'primary' },
    { label: 'Üyeler', value: stats.members, to: '/admin/members', color: 'primary' },
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-dark-gray mb-6">Özet</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ label, value, to, color }) => (
          <Link key={to} to={to} className="card p-6 hover:shadow-corp-hover transition-shadow">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-3xl font-semibold text-primary mt-2">{value}</p>
            <span className="text-sm text-primary mt-2 inline-block">Yönet →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
