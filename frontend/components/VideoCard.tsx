import Image from 'next/image';
import Link from 'next/link';
import type { VideoItem } from '../lib/dummyData';

type Props = {
  item: VideoItem;
};

export function VideoCard({ item }: Props) {
  return (
    <Link
      href={item.href}
      className="group overflow-hidden rounded-3xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[21/9] overflow-hidden">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/35 via-black/10 to-transparent">
          <div className="grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-colors group-hover:bg-white/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-burgundy line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.excerpt}</p>
        <p className="mt-3 text-xs text-slate-400">{item.date}</p>
      </div>
    </Link>
  );
}

