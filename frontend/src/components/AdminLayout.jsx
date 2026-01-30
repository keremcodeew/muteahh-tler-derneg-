import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { to: '/admin', label: 'Özet', end: true },
  { to: '/admin/news', label: 'Haberler', end: false },
  { to: '/admin/announcements', label: 'Duyurular', end: false },
  { to: '/admin/members', label: 'Üyeler', end: false },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-dark-gray text-white shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link to="/" className="font-serif text-lg font-semibold text-white">Müteahhitler Derneği</Link>
          <p className="text-xs text-gray-400 mt-1">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link to="/" className="block px-4 py-2 text-sm text-gray-400 hover:text-white">Siteye Dön</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white mt-1">
            Çıkış
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
          <h1 className="font-serif text-xl font-semibold text-dark-gray">Yönetim Paneli</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
