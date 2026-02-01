'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getToken } from '../lib/api';

type NavItem = { href: string; label: string };

export function Header() {
  const navItems: NavItem[] = useMemo(
    () => [
      { href: '/', label: 'Ana Sayfa' },
      { href: '/kurumsal', label: 'Kurumsal' },
      { href: '/uyelerimiz', label: 'Üyelerimiz' },
      { href: '/duyurular', label: 'Hakkımızda' },
      { href: '/haberler', label: 'Haberler' },
      { href: '/yayinlar', label: 'Yayınlar' },
      { href: '/iletisim', label: 'İletişim' },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-xl bg-burgundy text-white shadow-card">
            <span className="text-sm font-bold">AMD</span>
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold text-slate-900">Antalya Müteahhitler Derneği</div>
            <div className="text-xs text-slate-500">Kurumsal</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-4 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <div className="hidden shrink-0 items-center gap-1 xl:flex">
            <IconButton label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
            <IconButton label="X">
              <XIcon />
            </IconButton>
            <IconButton label="Instagram">
              <InstagramIcon />
            </IconButton>
          </div>

          {/* CTA */}
          <Link
            href={hasToken ? '/profilim' : '/login'}
            className="rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-burgundy-dark hover:shadow-card-hover"
          >
            {hasToken ? 'Profilim' : 'ÜYE GİRİŞİ'}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-black/10 bg-white text-slate-800 transition-colors hover:bg-soft-gray lg:hidden"
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="w-full border-t border-black/5 bg-white lg:hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-soft-gray hover:text-burgundy"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full bg-soft-gray text-slate-600 transition-colors hover:bg-white hover:text-burgundy"
    >
      {children}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
    </svg>
  );
}

