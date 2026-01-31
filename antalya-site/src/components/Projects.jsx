import { projects } from '../data/mockData';
import Card from './Card';

export default function Projects() {
  return (
    <section id="projeler" className="section projects">
      <div className="container">
        <h2 className="section-title">Projelerimiz</h2>
        <div className="projects__grid">
          {projects.map((item) => (
            <Card key={item.id} className="project-card">
              <div className="project-card__image-wrap">
                <img src={item.image} alt={item.title} />
                <span className="project-card__category">{item.category}</span>
              </div>
              <div className="project-card__body">
                <h3 className="project-card__title">{item.title}</h3>
                <p className="project-card__desc">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="projects__action">
          <a href="#projeler" className="btn btn-outline">Tüm Projeler</a>
        </div>
      </div>

      <style>{`
        .projects {
          background: var(--color-white);
        }

        .projects__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .projects__grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.75rem;
          }
        }

        .project-card__image-wrap {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .project-card__image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-card__category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 0.35rem 0.75rem;
          background: var(--color-gold);
          color: var(--color-navy);
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
        }

        .project-card__body {
          padding: 1.25rem;
        }

        .project-card__title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-navy);
          margin-bottom: 0.5rem;
        }

        .project-card__desc {
          font-size: 0.9375rem;
          color: var(--color-gray-600);
          line-height: 1.5;
        }

        .projects__action {
          margin-top: 2rem;
          text-align: center;
        }
      `}</style>
    </section>
  );
}
