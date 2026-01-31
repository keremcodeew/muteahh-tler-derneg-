import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/#hakkimizda', label: 'Kurumsal' },
  { to: '/members', label: 'Üyelerimiz' },
  { to: '/announcements', label: 'Duyurular' },
  { to: '/news', label: 'Haberler' },
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
    <header className="sticky top-0 z-50 bg-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 32 32">
                <path d="M16 2L4 8v6l12 6 12-6V8L16 2zm0 2.5L22 8l-6 3.5L10 8l6-3.5zM6 9.5l4 2v4L6 13.5v-4zm20 0v4l-4 2v-4l4-2zM16 14l-4 2v4l4 2 4-2v-4l-4-2zM8 22l8 4 8-4v-2l-8 4-8-4v2z"/>
              </svg>
            </div>
            <span className="text-base font-medium hidden sm:inline">
              Antalya <span className="font-semibold">Müteahhitler</span> Derneği
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive ? 'text-gold bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <a href="#" className="p-2 text-white/80 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="p-2 text-white/80 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="p-2 text-white/80 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
            <Link to="/demo" className="text-sm text-white/90 hover:text-white py-2 px-2 hidden lg:inline">Demo Gör</Link>
            {isContentAdmin && (
              <Link to="/admin" className="text-sm text-gold hover:text-gold-light py-2 px-3 hidden sm:inline">
                Yönetim
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm text-white/90 hover:text-white py-2 px-3">
                Çıkış
              </button>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-navy bg-gold hover:bg-gold-light px-4 py-2 rounded transition-colors">
                Üye Girişi
              </Link>
            )}
            <button
              type="button"
              className="md:hidden p-2 text-white/90 hover:text-white"
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
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded font-medium text-white/90 hover:bg-white/10">
                  {label}
                </NavLink>
              ))}
              <Link to="/demo" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-white/90">Demo Gör</Link>
              {isContentAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-gold">Yönetim</Link>
              )}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-gold font-semibold">Üye Girişi</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
