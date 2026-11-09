const proofs = [
  "Temps réel · < 100 ms visés",
  "Offline-first · continuité de service",
  "Cloisonnement RLS par institution",
  "4 interfaces · un seul moteur",
  "Banques · hôpitaux · administrations",
  "Multi-agences · Burundi, RDC, Rwanda",
];

export function ProofMarquee() {
  const track = [...proofs, ...proofs];

  return (
    <section
      className="marquee-mask relative overflow-hidden border-y border-brand-forest/12 bg-brand-cream py-5"
      aria-label="Garanties techniques TONDE"
    >
      <div className="marquee-track items-center gap-10" aria-hidden="true">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em] text-brand-forest/70"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-brand-leaf/60" />
          </span>
        ))}
      </div>
      <p className="sr-only">
        Garanties TONDE : temps réel sous 100 ms, fonctionnement hors ligne, cloisonnement des données par
        institution, quatre interfaces sur un moteur unique, pour banques, hôpitaux et administrations en
        Afrique de l’Est et centrale.
      </p>
    </section>
  );
}
