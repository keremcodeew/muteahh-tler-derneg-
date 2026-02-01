import { Suspense } from 'react';
import { NewsDetailView } from './view';

export default function NewsDetailPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 py-10 text-sm text-slate-600">Yükleniyor…</div>}>
      <NewsDetailView />
    </Suspense>
  );
}

