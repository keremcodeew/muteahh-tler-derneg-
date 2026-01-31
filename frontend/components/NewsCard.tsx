import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '../lib/dummyData';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  return (
    <Link
      href="#"
      className="group overflow-hidden rounded-3xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-burgundy line-clamp-2 sm:text-base">
          {item.title}
        </h3>
        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 sm:text-sm sm:mt-2">{item.excerpt}</p>
        <p className="mt-2 text-xs text-slate-400 sm:mt-3">{item.date}</p>
      </div>
    </Link>
  );
}

