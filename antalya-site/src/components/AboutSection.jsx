import { aboutData } from '../data/mockData';

export default function AboutSection() {
  return (
    <section id="hakkimizda" className="section about">
      <div className="container">
        <div className="about__grid">
          <div className="about__image-wrap">
            <img src={aboutData.image} alt={aboutData.title} className="about__image" />
          </div>
          <div className="about__content">
            <h2 className="about__title">{aboutData.title}</h2>
            <p className="about__desc">{aboutData.description}</p>
            <a href={aboutData.link} className="btn btn-outline about__btn">
              Devamını Oku
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .about {
          background: var(--color-gray-50);
        }

        .about__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .about__grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }

          .about__image-wrap {
            order: -1;
          }
        }

        .about__image-wrap {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }

        .about__image {
          width: 100%;
          height: auto;
          aspect-ratio: 4/3;
          object-fit: cover;
        }

        .about__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-navy);
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .about__title {
            font-size: 1.75rem;
          }
        }

        .about__desc {
          font-size: 0.9375rem;
          color: var(--color-gray-600);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .about__btn {
          display: inline-flex;
        }
      `}</style>
    </section>
  );
}
