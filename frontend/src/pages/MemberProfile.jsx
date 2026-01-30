import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { membersApi } from '../api/client';

const AVATAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    membersApi.get(id)
      .then(setMember)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card p-8 animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200" />
          <div className="h-6 bg-gray-200 rounded w-48 mt-6" />
          <div className="h-4 bg-gray-200 rounded w-32 mt-4" />
        </div>
      </div>
    );
  }
  if (error || !member) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Üye bulunamadı.</p>
        <Link to="/members" className="text-primary mt-2 inline-block">← Üyelere dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link to="/members" className="text-sm text-primary hover:underline mb-6 inline-block">← Üyelere dön</Link>
      <div className="card p-8 md:p-10 flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <img
            src={member.profileImageUrl || AVATAR_PLACEHOLDER}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-dark-gray mt-6">{member.name}</h1>
        {member.company && (
          <p className="text-lg text-gray-600 mt-1">{member.company}</p>
        )}
        {member.role && (
          <p className="text-primary font-medium mt-1">{member.role}</p>
        )}
        <p className="text-sm text-gray-500 mt-4">Üyelik tarihi: {formatDate(member.joinDate)}</p>
        {member.email && (
          <a href={`mailto:${member.email}`} className="mt-4 text-primary hover:underline text-sm">
            {member.email}
          </a>
        )}
      </div>
    </div>
  );
}
