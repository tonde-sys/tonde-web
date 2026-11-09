/**
 * Scène illustrée du hero : un usager retire son ticket à la borne pendant que
 * deux personnes attendent sur le banc, sous l'écran mural qui affiche l'appel.
 *
 * Tout est animé en CSS (`scene-*` dans globals.css) sur une boucle unique de
 * 5,6 s, pour que les mouvements restent synchronisés sans JavaScript.
 * Le `prefers-reduced-motion` global fige la scène sur sa première image.
 */

type SeatedProps = {
  x: number;
  torso: string;
  leg: string;
};

const SKIN = "#D9DFEA";

function Seated({ x, torso, leg }: SeatedProps) {
  return (
    <g>
      <g className="scene-breathe">
        <rect x={x - 15} y={168} width={30} height={60} rx={13} fill={torso} />
        <rect x={x - 30} y={216} width={34} height={12} rx={6} fill={leg} />
        <rect x={x - 30} y={224} width={11} height={34} rx={5} fill={leg} />
        <rect x={x - 36} y={252} width={18} height={7} rx={3} fill="#161E32" />
        {/* Bras : épaule → coude → main posée sur le genou. Tracé en couleur peau
            pour rester lisible sur les deux valeurs de torse. */}
        <path
          d={`M ${x - 12} 182 L ${x - 19} 202 L ${x - 25} 216`}
          fill="none"
          stroke={SKIN}
          strokeWidth={7.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle cx={x} cy={154} r={13} fill={SKIN} />
      <g className="scene-blink">
        <rect x={x - 6} y={150} width={2.6} height={3.6} rx={1.3} fill="#0A0E1A" />
        <rect x={x - 1} y={150} width={2.6} height={3.6} rx={1.3} fill="#0A0E1A" />
      </g>
    </g>
  );
}

export function HeroIllustration() {
  return (
    <figure className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#0A0E1A] shadow-[0_30px_70px_-28px_rgba(0,0,0,0.85)]">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <svg
        viewBox="0 0 440 300"
        className="relative block h-auto w-full"
        role="img"
        aria-labelledby="hero-scene-title hero-scene-desc"
      >
        <title id="hero-scene-title">Salle d’attente d’une agence TONDE</title>
        <desc id="hero-scene-desc">
          Un usager retire son ticket à la borne pendant que deux personnes attendent sur un banc,
          sous l’écran mural qui affiche l’appel en cours.
        </desc>

        {/* Sol */}
        <rect x="0" y="262" width="440" height="38" fill="#0C1322" />
        <rect x="0" y="262" width="440" height="1" fill="#1E2740" />

        {/* Enseigne murale */}
        <g>
          <rect
            x="24"
            y="34"
            width="104"
            height="28"
            rx="6"
            fill="#131C2E"
            stroke="#243049"
            strokeWidth="1.2"
          />
          <text
            x="40"
            y="53"
            fill="#5C6880"
            fontSize="11"
            fontWeight="600"
            letterSpacing="3"
            fontFamily="var(--font-sans)"
          >
            TONDE
          </text>
        </g>

        {/* Écran d’appel */}
        <g>
          <rect
            x="246"
            y="18"
            width="170"
            height="88"
            rx="12"
            fill="#111A2C"
            stroke="#243049"
            strokeWidth="1.5"
          />
          <text
            x="264"
            y="44"
            fill="#7A8499"
            fontSize="9"
            fontWeight="600"
            letterSpacing="1.5"
            fontFamily="var(--font-sans)"
          >
            APPEL EN COURS
          </text>
          <text
            x="262"
            y="86"
            fill="#00D4FF"
            fontSize="36"
            fontWeight="500"
            letterSpacing="-1.5"
            fontFamily="var(--font-mono)"
          >
            B-049
          </text>
          <circle cx="396" cy="80" r="3.5" fill="#00D4FF" />
        </g>

        {/* Banc */}
        <g>
          <rect x="232" y="226" width="192" height="9" rx="4" fill="#232E48" />
          <rect x="244" y="235" width="7" height="27" rx="3" fill="#1A2338" />
          <rect x="404" y="235" width="7" height="27" rx="3" fill="#1A2338" />
        </g>

        <Seated x={274} torso="#39456B" leg="#232E48" />
        <Seated x={356} torso="#2E3A5C" leg="#1F2841" />

        {/* Borne à tickets */}
        <g>
          <rect
            x="24"
            y="118"
            width="92"
            height="144"
            rx="16"
            fill="#141D30"
            stroke="#26314A"
            strokeWidth="1.5"
          />
          <rect x="40" y="134" width="60" height="70" rx="9" fill="#121A2C" className="scene-screen" />
          <rect
            x="40"
            y="134"
            width="60"
            height="70"
            rx="9"
            fill="#6C47FF"
            className="scene-halo"
            aria-hidden="true"
          />
          <g aria-hidden="true">
            <rect
              x="56"
              y="159"
              width="28"
              height="20"
              rx="3"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="1.8"
            />
            <line
              x1="70"
              y1="159"
              x2="70"
              y2="179"
              stroke="#00D4FF"
              strokeWidth="1.2"
              opacity="0.45"
            />
          </g>

          {/* Ticket qui sort de la fente */}
          <g className="scene-ticket" aria-hidden="true">
            <rect x="54" y="220" width="32" height="20" rx="3" fill="#E8ECF4" />
            <rect x="59" y="226" width="16" height="2.2" rx="1.1" fill="#8C94A8" />
            <rect x="59" y="232" width="10" height="2.2" rx="1.1" fill="#B4BACB" />
          </g>
          <rect x="42" y="228" width="56" height="8" rx="4" fill="#080E1A" stroke="#26314A" />
        </g>

        {/* Usager debout, bras tendu vers l’écran de la borne */}
        <g>
          <rect x="160" y="222" width="9" height="40" rx="4" fill="#1E2740" />
          <rect x="173" y="222" width="9" height="40" rx="4" fill="#1E2740" />
          <g className="scene-breathe">
            <rect x="152" y="168" width="36" height="62" rx="17" fill="#6C47FF" />
            <rect x="165" y="160" width="10" height="10" fill="#C9D1DF" />
          </g>
          <circle cx="170" cy="152" r="15" fill="#D9DFEA" />
          <g className="scene-blink">
            <rect x="159.5" y="148" width="2.8" height="4" rx="1.4" fill="#0A0E1A" />
            <rect x="164.5" y="148" width="2.8" height="4" rx="1.4" fill="#0A0E1A" />
          </g>
          <g className="scene-arm">
            {/* Bras tendu vers l’écran de la borne, avec un coude marqué et une
                main posée sur la dalle tactile. */}
            <path
              d="M 158 182 L 132 186 L 108 177"
              fill="none"
              stroke={SKIN}
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="106" cy="176" r="5.5" fill={SKIN} />
          </g>
        </g>
      </svg>

      <figcaption className="relative flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
          Aperçu produit
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-sprout/70" aria-hidden="true" />
          Démonstration
        </span>
      </figcaption>
    </figure>
  );
}
