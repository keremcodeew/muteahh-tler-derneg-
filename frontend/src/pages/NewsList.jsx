import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../api/client';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    newsApi.list(page, 9)
      .then(setData)
      .catch(() => setData({ items: [], total: 0, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-dark-gray">Haberler</h1>
        <p className="mt-2 text-gray-600">Dernek ve sektör haberleri</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">Henüz haber yok.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="card group overflow-hidden">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl || PLACEHOLDER}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs text-gray-500">{formatDate(item.publishDate)}</span>
                  <h2 className="font-serif text-lg font-semibold text-dark-gray mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                type="button"
                onClick={() => setSearchParams({ page: String(page - 1) })}
                disabled={page <= 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Önceki
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                {page} / {data.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setSearchParams({ page: String(page + 1) })}
                disabled={page >= data.totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
