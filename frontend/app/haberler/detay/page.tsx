import { Suspense } from 'react';
import { PageLayoutWithFooter } from '../../../components/PageLayout';
import { NewsDetailClient } from './view';

export default function NewsDetailPage() {
  return (
    <PageLayoutWithFooter>
      <Suspense
        fallback={<div className="rounded-3xl bg-soft-gray p-6 text-sm text-slate-600">Yükleniyor…</div>}
      >
        <NewsDetailClient />
      </Suspense>
    </PageLayoutWithFooter>
  );
}

