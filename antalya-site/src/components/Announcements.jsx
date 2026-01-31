import { announcements } from '../data/mockData';
import Card from './Card';

export default function Announcements() {
  return (
    <section id="duyurular" className="section announcements">
      <div className="container">
        <h2 className="section-title">Güncel Duyurular</h2>
        <div className="announcements__grid">
          {announcements.map((item) => (
            <Card key={item.id} className="announcement-card">
              <div className="announcement-card__image-wrap">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="announcement-card__body">
                <span className="announcement-card__date">{item.date}</span>
                <h3 className="announcement-card__title">{item.title}</h3>
                <p className="announcement-card__desc">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        .section {
          padding: 3rem 0;
        }

        @media (min-width: 768px) {
          .section {
            padding: 4rem 0;
          }
        }

        .announcements {
          background: var(--color-gray-50);
        }

        .announcements__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .announcements__grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.75rem;
          }
        }

        .announcement-card__image-wrap {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .announcement-card__image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .announcement-card__body {
          padding: 1.25rem;
        }

        .announcement-card__date {
          font-size: 0.8125rem;
          color: var(--color-gold);
          font-weight: 600;
        }

        .announcement-card__title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-navy);
          margin: 0.5rem 0 0.75rem;
          line-height: 1.35;
        }

        .announcement-card__desc {
          font-size: 0.9375rem;
          color: var(--color-gray-600);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
