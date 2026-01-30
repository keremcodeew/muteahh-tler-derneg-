import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../api/client';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    newsApi.get(id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="aspect-video bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }
  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Haber bulunamadı.</p>
        <Link to="/news" className="text-primary mt-2 inline-block">← Haberlere dön</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link to="/news" className="text-sm text-primary hover:underline mb-6 inline-block">← Haberlere dön</Link>
      <header>
        <time className="text-sm text-gray-500">{formatDate(item.publishDate)}</time>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-dark-gray mt-2">{item.title}</h1>
      </header>
      {item.imageUrl && (
        <div className="mt-6 rounded-xl overflow-hidden shadow-corp">
          <img src={item.imageUrl} alt="" className="w-full aspect-video object-cover" />
        </div>
      )}
      {!item.imageUrl && (
        <div className="mt-6 rounded-xl overflow-hidden shadow-corp aspect-video bg-gray-100">
          <img src={PLACEHOLDER} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="mt-8 prose prose-gray max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{item.content}</div>
      </div>
    </article>
  );
}
