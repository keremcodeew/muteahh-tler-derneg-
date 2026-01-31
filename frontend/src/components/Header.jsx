import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/#hakkimizda', label: 'Hakkımızda' },
  { to: '/#duyurular', label: 'Duyurular' },
  { to: '/#projeler', label: 'Projeler' },
  { to: '/#uyelik', label: 'Üyelik' },
  { to: '/contact', label: 'İletişim' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isContentAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-sky-light rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-navy" fill="currentColor" viewBox="0 0 32 32">
                <path d="M16 2L4 8v6l12 6 12-6V8L16 2zm0 2.5L22 8l-6 3.5L10 8l6-3.5zM6 9.5l4 2v4L6 13.5v-4zm20 0v4l-4 2v-4l4-2zM16 14l-4 2v4l4 2 4-2v-4l-4-2zM8 22l8 4 8-4v-2l-8 4-8-4v2z"/>
              </svg>
            </div>
            <span className="text-base text-dark-gray hidden sm:inline">
              <span>Antalya</span> <span className="font-semibold">Müteahhitler</span> <span>Derneği</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-primary/5' : 'text-dark-gray hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                {label.toUpperCase()}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/demo" className="text-sm font-medium text-primary hover:underline py-2 px-3 hidden sm:inline">
              Demo Gör
            </Link>
            {isContentAdmin && (
              <Link to="/admin" className="btn-secondary text-sm py-2 px-4 hidden sm:inline-flex">
                Yönetim
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm font-medium text-dark-gray hover:text-primary transition-colors py-2 px-3">
                Çıkış
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-5 rounded-lg">
                GİRİŞ
              </Link>
            )}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-dark-gray hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menü"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col gap-1">
              <Link to="/demo" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-medium text-primary">
                Demo Gör
              </Link>
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md font-medium ${isActive ? 'text-primary bg-primary/5' : 'text-dark-gray'}`
                  }
                >
                  {label.toUpperCase()}
                </NavLink>
              ))}
              {isContentAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-medium text-primary">
                  Yönetim
                </Link>
              )}
              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-medium text-dark-gray">
                    Giriş
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-3 font-medium text-primary">
                    Üye Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
