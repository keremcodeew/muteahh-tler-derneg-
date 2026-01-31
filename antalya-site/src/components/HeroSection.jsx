import { heroData } from '../data/mockData';

export default function HeroSection() {
  return (
    <section className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
      />
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{heroData.title}</h1>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .hero {
            min-height: 420px;
          }
        }

        @media (min-width: 1024px) {
          .hero {
            min-height: 500px;
          }
        }

        .hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }

        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(30, 58, 95, 0.6) 0%,
            rgba(21, 41, 66, 0.8) 100%
          );
        }

        .hero__content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          text-align: center;
        }

        .hero__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-white);
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        @media (min-width: 768px) {
          .hero__title {
            font-size: 2.25rem;
          }
        }

        @media (min-width: 1024px) {
          .hero__title {
            font-size: 2.75rem;
          }
        }
      `}</style>
    </section>
  );
}
