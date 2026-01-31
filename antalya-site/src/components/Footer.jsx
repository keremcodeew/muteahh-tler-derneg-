export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="iletisim" className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <span className="footer__logo">Antalya Müteahhitler Derneği</span>
            <p className="footer__tagline">
              İnşaat sektöründe kalite, güven ve dayanışma için bir arada.
            </p>
          </div>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Antalya Müteahhitler Derneği. Tüm hakları saklıdır.
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--color-navy-dark);
          color: var(--color-gray-200);
          padding: 2.5rem 1.25rem;
        }

        @media (min-width: 768px) {
          .footer {
            padding: 3rem 1.5rem;
          }
        }

        .footer__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer__main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .footer__main {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .footer__logo {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-white);
          display: block;
        }

        .footer__tagline {
          font-size: 0.875rem;
          opacity: 0.85;
          margin-top: 0.5rem;
          max-width: 320px;
        }

        .footer__social {
          display: flex;
          gap: 1rem;
        }

        .footer__social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          color: var(--color-white);
          transition: background 0.2s, color 0.2s;
        }

        .footer__social-link:hover {
          background: var(--color-gold);
          color: var(--color-navy);
        }

        .footer__bottom {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center;
        }

        .footer__copyright {
          font-size: 0.8125rem;
          opacity: 0.8;
        }
      `}</style>
    </footer>
  );
}
