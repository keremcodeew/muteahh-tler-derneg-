'use client';

import { useRef } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
};

export function ImageUrlInput({ value, onChange, placeholder = 'URL veya dosya seçin', accept = 'image/*', className = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') onChange(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-burgundy"
      />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Dosya seç"
        title="Dosya seç"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="shrink-0 rounded-2xl border border-burgundy bg-white px-4 py-3 text-sm font-semibold text-burgundy transition-colors hover:bg-burgundy hover:text-white"
      >
        Dosya Seç
      </button>
    </div>
  );
}
