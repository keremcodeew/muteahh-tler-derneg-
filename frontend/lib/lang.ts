import { useEffect, useState } from 'react';

export type Lang = 'TR' | 'EN';

const KEY = 'amd_lang';

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'TR';
  const raw = window.localStorage.getItem(KEY);
  return raw === 'EN' ? 'EN' : 'TR';
}

export function setLang(lang: Lang) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, lang);
  window.dispatchEvent(new Event('amd_lang'));
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(() => getLang());

  useEffect(() => {
    const onChange = () => setLangState(getLang());
    window.addEventListener('storage', onChange);
    window.addEventListener('amd_lang', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('amd_lang', onChange);
    };
  }, []);

  const set = (next: Lang) => setLang(next);
  return { lang, setLang: set };
}

