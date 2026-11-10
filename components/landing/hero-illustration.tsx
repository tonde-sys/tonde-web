"use client";

/**
 * Scène du hero — « L'attente change de dimension ».
 *
 * Une salle d'attente isométrique en 2.5D, animée par une seule boucle CSS de
 * 10 s. Quatre temps, dans cet ordre :
 *
 *   0 – 2 s   Le problème     : la file stagne, l'écran affiche B-042.
 *   2 – 5 s   TONDE intervient: le téléphone monte au premier plan, ticket B-049.
 *   5 – 8 s   Synchronisation : l'écran et le téléphone avancent ensemble,
 *                               les gens se lèvent, le guichet s'allume.
 *   8 – 10 s  Résultat        : le client se présente, la salle s'éclaire.
 *
 * Toutes les animations partagent `animation-duration: 10s` et sont pilotées en
 * pourcentages, ce qui garantit qu'elles restent en phase sans JavaScript.
 * `prefers-reduced-motion` fige la scène sur son état final (voir globals.css).
 *
 * Contrainte de lisibilité : la carte fait ~420 px de large, donc deux nombres
 * seulement sont lisibles (le ticket et le compteur). Le reste est du texte de
 * texture, volontairement à 5–6 px.
 */

import { faces, iso, poly } from "@/lib/iso";

const C = {
  floorTop: "#0D1424",
  floorLeft: "#080D17",
  floorRight: "#060A12",
  wallTop: "#1A2440",
  wallLeft: "#0F1728",
  wallRight: "#0B1120",
  benchTop: "#31405F",
  benchLeft: "#1A2338",
  benchRight: "#131A2A",
  counterTop: "#2A3757",
  counterLeft: "#1D2740",
  counterRight: "#161E31",
  kioskTop: "#222E4C",
  kioskLeft: "#182238",
  kioskRight: "#121A2B",
  violet: "#6C47FF",
  cyan: "#00D4FF",
  skin: "#DCE2ED",
  skinWarm: "#C9D1DF",
  cloth: "#39456B",
  clothAlt: "#2E3A5C",
} as const;

const ROOM = { x: 118, y: 86, wall: 32 };

function Cuboid({
  x,
  y,
  z,
  w,
  d,
  h,
  top,
  left,
  right,
  className,
  opacity,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  top: string;
  left: string;
  right: string;
  className?: string;
  opacity?: number;
}) {
  const f = faces(x, y, z, w, d, h);
  return (
    <g className={className} opacity={opacity}>
      <polygon points={f.top} fill={top} />
      <polygon points={f.left} fill={left} />
      <polygon points={f.right} fill={right} />
    </g>
  );
}

/** Personnage stylisé : capsule verticale, tête sphérique, membres en segments.
 *  Proportions calées sur une silhouette de 31 unités : tête r 4.2 (diamètre
 *  8.4 < largeur du torse 10), épaules à 22.5, hanches à 15. Assis, la hanche
 *  descend à 11 — la hauteur du banc — d’où une silhouette de 27 unités. */
function Person({
  x,
  y,
  cloth,
  seated,
  className,
  facing = 1,
}: {
  x: number;
  y: number;
  cloth: string;
  seated?: boolean;
  className?: string;
  facing?: 1 | -1;
}) {
  const [cx, base] = iso(x, y, 0);
  const headR = 4.2;
  const hipZ = seated ? 11 : 15;
  const shoulderZ = hipZ + 7.5;
  const hipY = base - hipZ;
  const shoulderY = base - shoulderZ;

  return (
    <g className={className}>
      {/* Ombre portée : ellipse au sol, rapport 2:1 comme la projection */}
      <ellipse cx={cx} cy={base} rx={7.6} ry={3.6} fill="#04070D" opacity={0.6} />

      {seated ? (
        <>
          {/* cuisse : hanche → genou, vers l’avant */}
          <line
            x1={cx}
            y1={hipY}
            x2={cx + 9 * facing}
            y2={hipY + 5}
            stroke={cloth}
            strokeWidth={6.4}
            strokeLinecap="round"
          />
          {/* tibia : genou → sol */}
          <line
            x1={cx + 9 * facing}
            y1={hipY + 5}
            x2={cx + 9 * facing}
            y2={base}
            stroke={cloth}
            strokeWidth={5.4}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <line x1={cx - 2.4} y1={hipY} x2={cx - 2.4} y2={base} stroke={cloth} strokeWidth={5} strokeLinecap="round" />
          <line x1={cx + 2.4} y1={hipY} x2={cx + 2.4} y2={base} stroke={cloth} strokeWidth={5} strokeLinecap="round" />
        </>
      )}

      {/* Torse */}
      <rect
        x={cx - 5}
        y={shoulderY}
        width={10}
        height={hipY - shoulderY + 3.5}
        rx={5}
        fill={cloth}
      />

      {/* Bras */}
      <line
        x1={cx + 3.6 * facing}
        y1={shoulderY + 2.6}
        x2={cx + (seated ? 7.6 : 6) * facing}
        y2={shoulderY + (seated ? 11 : 13)}
        stroke={C.skinWarm}
        strokeWidth={3.6}
        strokeLinecap="round"
      />

      {/* Tête */}
      <circle cx={cx} cy={shoulderY - headR + 0.4} r={headR} fill={C.skin} />
    </g>
  );
}

export function HeroIllustration() {
  const benchZ = 11;
  const seatY = [24, 44, 64];

  return (
    <figure className="relative overflow-hidden rounded-[20px] border border-white/12 bg-[#080C16] shadow-[0_30px_70px_-28px_rgba(0,0,0,0.85)]">
      <svg
        viewBox="0 0 440 360"
        className="relative block h-auto w-full"
        role="img"
        aria-labelledby="ts-title ts-desc"
      >
        <title id="ts-title">L’attente change de dimension</title>
        <desc id="ts-desc">
          Une salle d’attente isométrique : des personnes patientent devant un écran qui appelle les
          tickets. Un téléphone affiche le ticket B-049 et le nombre de personnes devant. Les numéros
          avancent ensemble, le guichet s’allume, la personne est appelée.
        </desc>

        <defs>
          <radialGradient id="ts-flood" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#6C47FF" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#00D4FF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ts-sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C47FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <rect width="440" height="360" fill="#080C16" />

        {/* Halo qui s’allume au dernier temps */}
        <g className="ts-flood" opacity={0}>
          <rect width="440" height="360" fill="url(#ts-flood)" />
        </g>

        <g transform="translate(189 82) scale(2.25)">
          {/* Sol */}
          <Cuboid
            x={-3}
            y={-3}
            z={-4}
            w={ROOM.x + 6}
            d={ROOM.y + 6}
            h={4}
            top={C.floorTop}
            left={C.floorLeft}
            right={C.floorRight}
          />

          {/* Trame du sol */}
          <g stroke="#1A2540" strokeWidth={0.35} opacity={0.55}>
            {Array.from({ length: 7 }, (_, i) => {
              const y = 12 + i * 11;
              return (
                <line
                  key={`gx${i}`}
                  x1={iso(0, y)[0]}
                  y1={iso(0, y)[1]}
                  x2={iso(ROOM.x, y)[0]}
                  y2={iso(ROOM.x, y)[1]}
                />
              );
            })}
            {Array.from({ length: 9 }, (_, i) => {
              const x = 12 + i * 13;
              return (
                <line
                  key={`gy${i}`}
                  x1={iso(x, 0)[0]}
                  y1={iso(x, 0)[1]}
                  x2={iso(x, ROOM.y)[0]}
                  y2={iso(x, ROOM.y)[1]}
                />
              );
            })}
          </g>

          {/* Murs du fond */}
          <Cuboid
            x={0}
            y={0}
            z={0}
            w={ROOM.x}
            d={3}
            h={ROOM.wall}
            top={C.wallTop}
            left={C.wallLeft}
            right={C.wallRight}
          />
          <Cuboid
            x={0}
            y={3}
            z={0}
            w={3}
            d={ROOM.y - 3}
            h={ROOM.wall}
            top={C.wallTop}
            left={C.wallLeft}
            right={C.wallRight}
          />

          {/* Enseigne TONDE sur le mur gauche */}
          <g>
            <rect
              x={iso(3.2, 16, 24)[0]}
              y={iso(3.2, 16, 24)[1]}
              width={28}
              height={8}
              rx={1.8}
              fill="#0E1727"
              stroke="#233049"
              strokeWidth={0.4}
            />
            <text
              x={iso(3.2, 16, 24)[0] + 14}
              y={iso(3.2, 16, 24)[1] + 5.4}
              textAnchor="middle"
              fill="#5C6880"
              fontSize={4.6}
              fontWeight={600}
              letterSpacing={1.5}
              fontFamily="var(--font-sans)"
            >
              TONDE
            </text>
          </g>

          {/* Écran d’appel — panneau plaqué sur le mur du fond.
              matrix : u le long du mur, v = −z (donc le texte reste droit). */}
          <g className="ts-screen" transform="matrix(0.866 0.5 0 1 -2.6 1.5)">
            <rect
              x={28}
              y={-30}
              width={42}
              height={20}
              rx={2.2}
              fill="#0B1322"
              stroke="#243049"
              strokeWidth={0.5}
            />
            <text
              x={32}
              y={-24}
              fill="#5E6A82"
              fontSize={3.2}
              fontWeight={600}
              letterSpacing={0.85}
              fontFamily="var(--font-sans)"
            >
              APPEL EN COURS
            </text>

            {/* Numéros qui défilent */}
            <g fontFamily="var(--font-mono)" fontSize={12} fontWeight={500} letterSpacing={-0.4}>
              <text className="ts-n1" x={31} y={-12} fill={C.cyan}>
                B-042
              </text>
              <text className="ts-n2" x={31} y={-12} fill={C.cyan} opacity={0}>
                B-045
              </text>
              <text className="ts-n3" x={31} y={-12} fill={C.cyan} opacity={0}>
                B-048
              </text>
              <text className="ts-n4" x={31} y={-12} fill={C.cyan} opacity={0}>
                B-049
              </text>
            </g>
          </g>

          {/* Banc */}
          <Cuboid
            x={9}
            y={16}
            z={benchZ - 3}
            w={14}
            d={64}
            h={3}
            top={C.benchTop}
            left={C.benchLeft}
            right={C.benchRight}
          />
          <Cuboid
            x={6}
            y={16}
            z={benchZ - 3}
            w={3}
            d={64}
            h={13}
            top={C.benchTop}
            left={C.benchLeft}
            right={C.benchRight}
          />
          {[18, 74].map((y) => (
            <Cuboid
              key={`leg${y}`}
              x={11}
              y={y}
              z={0}
              w={10}
              d={4}
              h={benchZ - 3}
              top={C.benchLeft}
              left={C.benchLeft}
              right={C.benchRight}
            />
          ))}

          {/* Trois personnes assises */}
          <Person x={16} y={seatY[0]} cloth={C.cloth} seated />
          <Person x={16} y={seatY[1]} cloth={C.clothAlt} seated />
          <Person x={16} y={seatY[2]} cloth={C.cloth} seated />

          {/* Borne à tickets — au fond à gauche, dégagée de la trajectoire */}
          <g className="ts-kiosk">
            <Cuboid
              x={28}
              y={12}
              z={0}
              w={10}
              d={10}
              h={24}
              top={C.kioskTop}
              left={C.kioskLeft}
              right={C.kioskRight}
            />
            <g className="ts-kiosk-screen">
              <polygon
                points={poly([
                  [29, 22, 18],
                  [37, 22, 18],
                  [37, 22, 10],
                  [29, 22, 10],
                ])}
                fill={C.violet}
              />
            </g>
          </g>

          {/* Agent au guichet — peint avant le comptoir pour que celui-ci
              l’occulte jusqu’à la taille. */}
          <Person x={88} y={10} cloth={C.clothAlt} facing={-1} />

          {/* Guichet */}
          <Cuboid
            x={72}
            y={16}
            z={0}
            w={34}
            d={18}
            h={15}
            top={C.counterTop}
            left={C.counterLeft}
            right={C.counterRight}
          />
          <g className="ts-counter-light">
            <polygon
              points={poly([
                [74, 34, 15.7],
                [104, 34, 15.7],
                [104, 34, 14.9],
                [74, 34, 14.9],
              ])}
              fill={C.cyan}
            />
          </g>

          {/* Le client appelé traverse la salle vers le guichet */}
          <g className="ts-walker">
            <Person x={52} y={64} cloth={C.violet} />
          </g>
        </g>

        {/* Téléphone — panneau plat, au premier plan à gauche.
            Il occupe le sol libre devant le banc pour ne jamais masquer
            la trajectoire du client vers le guichet. */}
        <g className="ts-phone" opacity={0}>
          <rect x="18" y="198" width="132" height="138" rx="14" fill="#0B1120" stroke="#2A3552" />
          <rect x="24" y="204" width="120" height="126" rx="9" fill="#101A2E" />

          <text x="33" y="219" fill="#5C6880" fontSize="5" fontWeight={600} letterSpacing="1.4" fontFamily="var(--font-sans)">
            TONDE
          </text>
          <rect x="104" y="213" width="26" height="8" rx="4" fill="#00D4FF" opacity="0.16" />
          <text x="117" y="218.8" textAnchor="middle" fill="#00D4FF" fontSize="4.2" fontWeight={600} letterSpacing="0.7" fontFamily="var(--font-sans)">
            ACTIF
          </text>

          <text x="33" y="234" fill="#7C879C" fontSize="4.6" fontWeight={600} letterSpacing="1.1" fontFamily="var(--font-sans)">
            VOTRE TICKET
          </text>
          <text x="32" y="258" fill="#00D4FF" fontSize="22" fontWeight={600} letterSpacing="-0.7" fontFamily="var(--font-mono)">
            B-049
          </text>

          <line x1="33" y1="266" x2="135" y2="266" stroke="#1E2A44" strokeWidth="0.8" />

          <text x="33" y="277" fill="#7C879C" fontSize="4.4" fontWeight={500} letterSpacing="1" fontFamily="var(--font-sans)">
            PERSONNES AVANT VOUS
          </text>

          <g fontFamily="var(--font-mono)" fontSize="16" fontWeight={600} fill="#FFFFFF">
            <text className="ts-c4" x="32" y="296">04</text>
            <text className="ts-c3" x="32" y="296" opacity={0}>03</text>
            <text className="ts-c2" x="32" y="296" opacity={0}>02</text>
            <text className="ts-c1" x="32" y="296" opacity={0}>01</text>
            <text className="ts-c0" x="32" y="296" opacity={0} fill="#00D4FF">00</text>
          </g>

          <circle className="ts-live" cx="35" cy="313" r="1.8" fill="#00D4FF" />
          <text x="41" y="315" fill="#5C6880" fontSize="4.4" fontWeight={500} letterSpacing="0.8" fontFamily="var(--font-sans)">
            SUIVI EN TEMPS RÉEL
          </text>
        </g>

        {/* Carton final — posé dans le bas de l’image pour ne pas heurter
            la silhouette du client arrivé au guichet. */}
        <g className="ts-end" opacity={0}>
          <rect x="0" y="0" width="440" height="360" fill="#080C16" opacity="0.74" />
          <line x1="180" y1="246" x2="260" y2="246" stroke="#6C47FF" strokeWidth="1" />
          <text x="220" y="272" textAnchor="middle" fill="#FFFFFF" fontSize="17" fontWeight={600} letterSpacing="4.6" fontFamily="var(--font-sans)">
            TONDE
          </text>
          <text x="220" y="292" textAnchor="middle" fill="#00D4FF" fontSize="7.4" fontStyle="italic" fontFamily="var(--font-serif)">
            Votre temps a de la valeur.
          </text>
          <text x="220" y="303" textAnchor="middle" fill="#9AA5BC" fontSize="7.4" fontStyle="italic" fontFamily="var(--font-serif)">
            Tonde le respecte.
          </text>
        </g>
      </svg>

      <figcaption className="relative flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
          L’attente change de dimension
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-sprout/70" aria-hidden="true" />
          Boucle 10 s
        </span>
      </figcaption>
    </figure>
  );
}
