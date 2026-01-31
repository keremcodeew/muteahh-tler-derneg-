export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
      <style>{`
        .card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .card:hover {
          box-shadow: var(--shadow-hover);
        }
      `}</style>
    </div>
  );
}
