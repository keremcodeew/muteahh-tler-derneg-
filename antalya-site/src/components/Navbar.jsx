import { useState } from 'react';

const navItems = [
  { label: 'Ana Sayfa', href: '#' },
  { label: 'Hakkımızda', href: '#hakkimizda' },
  { label: 'Duyurular', href: '#duyurular' },
  { label: 'Projeler', href: '#projeler' },
  { label: 'Üyelik', href: '#uyelik' },
  { label: 'İletişim', href: '#iletisim' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a href="#" className="navbar__logo">
          Antalya Müteahhitler Derneği
        </a>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="navbar__link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a href="#giris" className="btn btn-primary navbar__login">
            Giriş
          </a>
          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menüyü aç/kapat"
          >
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-white);
          box-shadow: var(--shadow-soft);
        }

        .navbar__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar__logo {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-navy);
        }

        .navbar__nav {
          display: none;
          gap: 0.5rem;
        }

        @media (min-width: 768px) {
          .navbar__nav {
            display: flex;
            align-items: center;
          }
        }

        .navbar__link {
          padding: 0.5rem 0.75rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-gray-700);
          border-radius: var(--radius-sm);
          transition: color 0.2s, background 0.2s;
        }

        .navbar__link:hover {
          color: var(--color-navy);
          background: var(--color-gray-100);
        }

        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .navbar__login {
          display: none;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        @media (min-width: 768px) {
          .navbar__login {
            display: inline-flex;
          }
        }

        .navbar__toggle {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .navbar__toggle {
            display: none;
          }
        }

        .navbar__toggle-bar {
          width: 22px;
          height: 2px;
          background: var(--color-navy);
          border-radius: 1px;
        }

        @media (max-width: 767px) {
          .navbar__nav--open {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--color-white);
            padding: 1rem;
            box-shadow: var(--shadow-card);
            gap: 0.25rem;
          }

          .navbar__nav--open .navbar__link {
            padding: 0.75rem;
          }
        }
      `}</style>
    </header>
  );
}
