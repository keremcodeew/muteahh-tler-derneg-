import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '../lib/dummyData';
import { normalizeImageSrc } from '../lib/normalizeImageSrc';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  return (
    <Link
      href={`/haberler/detay?id=${encodeURIComponent(String(item.id))}`}
      className="group overflow-hidden rounded-3xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[21/9] overflow-hidden">
        <Image
          src={normalizeImageSrc(item.imageUrl)}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-burgundy line-clamp-2 sm:text-sm">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{item.excerpt}</p>
        <p className="mt-1.5 text-xs text-slate-400">{item.date}</p>
      </div>
    </Link>
  );
}

