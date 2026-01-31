import { testimonial } from '../data/mockData';

export default function MembershipCTA() {
  return (
    <section id="uyelik" className="section membership">
      <div className="container">
        <div className="membership__card">
          <div className="membership__main">
            <h2 className="membership__title">Derneğimize Üye Olun</h2>
            <p className="membership__desc">
              Antalya inşaat sektöründe güçlü bir ağa katılın. Eğitim, danışmanlık ve iş ortaklığı imkânlarından yararlanın.
            </p>
            <a href="#uyelik-form" className="btn btn-gold membership__cta">
              Üyelik Başvurusu
            </a>
          </div>
          <div className="membership__testimonial">
            <blockquote className="membership__quote">
              "{testimonial.quote}"
            </blockquote>
            <div className="membership__author">
              <strong>{testimonial.author}</strong>
              <span>{testimonial.role}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .membership {
          background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-dark) 100%);
          color: var(--color-white);
        }

        .membership__card {
          background: rgba(255,255,255,0.08);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: grid;
          gap: 2rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        @media (min-width: 768px) {
          .membership__card {
            grid-template-columns: 1fr 1fr;
            padding: 2.5rem;
            align-items: center;
          }
        }

        .membership__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        @media (min-width: 768px) {
          .membership__title {
            font-size: 1.75rem;
          }
        }

        .membership__desc {
          font-size: 0.9375rem;
          opacity: 0.9;
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }

        .membership__cta {
          display: inline-flex;
        }

        .membership__testimonial {
          padding-left: 1rem;
          border-left: 3px solid var(--color-gold);
        }

        .membership__quote {
          font-size: 0.9375rem;
          font-style: italic;
          opacity: 0.95;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .membership__author {
          display: flex;
          flex-direction: column;
          font-size: 0.875rem;
        }

        .membership__author strong {
          color: var(--color-gold-light);
        }

        .membership__author span {
          opacity: 0.8;
          font-size: 0.8125rem;
        }
      `}</style>
    </section>
  );
}
