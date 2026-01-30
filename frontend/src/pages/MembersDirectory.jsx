import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { membersApi } from '../api/client';

const AVATAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });
}

export default function MembersDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    membersApi.list(params)
      .then(setData)
      .catch(() => setData({ items: [], total: 0, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ ...Object.fromEntries(searchParams), search: searchInput, page: '1' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-dark-gray">Üyeler</h1>
          <p className="mt-2 text-gray-600">Dernek üyeleri rehberi</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            placeholder="İsim, firma veya rol ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field max-w-xs py-2"
          />
          <button type="submit" className="btn-primary py-2 px-4">Ara</button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto" />
              <div className="h-4 bg-gray-200 rounded mt-4 w-3/4 mx-auto" />
              <div className="h-3 bg-gray-200 rounded mt-2 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">Üye bulunamadı.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((member) => (
              <Link
                key={member.id}
                to={`/members/${member.id}`}
                className="card p-6 text-center group hover:border-primary/20 transition-all"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-gray-100">
                  <img
                    src={member.profileImageUrl || AVATAR_PLACEHOLDER}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h2 className="font-serif font-semibold text-dark-gray mt-4 group-hover:text-primary transition-colors">
                  {member.name}
                </h2>
                {member.company && (
                  <p className="text-sm text-gray-600 mt-1">{member.company}</p>
                )}
                {member.role && (
                  <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
                )}
                <span className="text-xs text-gray-400 mt-2 block">Üyelik: {formatDate(member.joinDate)}</span>
              </Link>
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                type="button"
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}
                disabled={page <= 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Önceki
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">{page} / {data.totalPages}</span>
              <button
                type="button"
                onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}
                disabled={page >= data.totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <h3 className="font-serif font-semibold text-dark-gray">Üye olmak ister misiniz?</h3>
        <p className="text-sm text-gray-600 mt-1">Derneğimize üye olarak ağımıza katılın.</p>
        <Link to="/register" className="btn-primary mt-4 inline-flex">Üyelik Başvurusu</Link>
      </div>
    </div>
  );
}
