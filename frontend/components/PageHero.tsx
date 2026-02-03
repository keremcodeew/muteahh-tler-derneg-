type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
      <div className="relative px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-xs font-semibold tracking-wide text-white/70">Antalya İnşaat Müteahhitleri Derneği</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-sm text-white/85 sm:text-base">{subtitle}</p> : null}
      </div>
    </section>
  );
}

