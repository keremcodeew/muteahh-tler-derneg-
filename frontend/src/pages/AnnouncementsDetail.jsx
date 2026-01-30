import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { announcementsApi } from '../api/client';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AnnouncementsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    announcementsApi.get(id)
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
        </div>
      </div>
    );
  }
  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Duyuru bulunamadı.</p>
        <Link to="/announcements" className="text-primary mt-2 inline-block">← Duyurulara dön</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link to="/announcements" className="text-sm text-primary hover:underline mb-6 inline-block">← Duyurulara dön</Link>
      <header>
        <time className="text-sm text-gray-500">{formatDate(item.publishDate)}</time>
        {item.eventDate && (
          <span className="text-sm text-primary ml-2">Etkinlik tarihi: {formatDate(item.eventDate)}</span>
        )}
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-dark-gray mt-2">{item.title}</h1>
      </header>
      {(item.imageUrl || true) && (
        <div className="mt-6 rounded-xl overflow-hidden shadow-corp aspect-video bg-gray-100">
          <img src={item.imageUrl || PLACEHOLDER} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="mt-8 prose prose-gray max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{item.content}</div>
      </div>
    </article>
  );
}
