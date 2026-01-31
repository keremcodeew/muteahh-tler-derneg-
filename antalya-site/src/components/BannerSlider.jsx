import { bannerItems } from '../data/mockData';

function BannerCard({ item }) {
  return (
    <a href={item.link} className="banner-card">
      <div className="banner-card__image-wrap" style={{ position: 'relative' }}>
        <img src={item.image} alt={item.title} className="banner-card__image" />
        <div className="banner-card__overlay" />
      </div>
      <div className="banner-card__content">
        <h3 className="banner-card__title">{item.title}</h3>
        <p className="banner-card__desc">{item.description}</p>
      </div>
    </a>
  );
}

export default function BannerSlider() {
  return (
    <section className="banner-section">
      <div className="banner-section__grid">
        {bannerItems.map((item) => (
          <BannerCard key={item.id} item={item} />
        ))}
      </div>

      <style>{`
        .banner-section {
          padding: 2.5rem 1.25rem;
          background: var(--color-white);
        }

        @media (min-width: 768px) {
          .banner-section {
            padding: 3rem 1.5rem;
          }
        }

        .banner-section__grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 768px) {
          .banner-section__grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }

        .banner-card {
          display: block;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: transform 0.2s, box-shadow 0.2s;
          background: var(--color-gray-100);
        }

        .banner-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .banner-card__image-wrap {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }


        .banner-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(30, 58, 95, 0.85) 0%,
            transparent 50%
          );
        }

        .banner-card__content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.25rem;
          color: var(--color-white);
        }

        .banner-card__title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .banner-card__desc {
          font-size: 0.875rem;
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
}
