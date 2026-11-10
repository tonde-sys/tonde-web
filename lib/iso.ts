/**
 * Projection isométrique et primitives géométriques.
 *
 * L'isométrie est une projection orthographique : pas de caméra, pas de
 * perspective. Un point de l'espace (x, y, z) tombe sur l'écran en
 *   sx = (x - y) · cos 30°
 *   sy = (x + y) · sin 30° − z
 *
 * Convention de la scène : x croît vers la droite et l'avant, y croît vers la
 * gauche et l'avant, z monte. L'observateur est donc du côté des grands x + y,
 * ce qui rend visibles les faces « haut », « y max » et « x max » de chaque
 * volume. C'est ce que dessine `faces()`.
 */

export type Point3 = [number, number, number];

const COS30 = 0.866;
const SIN30 = 0.5;

const round = (value: number) => Math.round(value * 100) / 100;

export function iso(x: number, y: number, z = 0): [number, number] {
  return [round((x - y) * COS30), round((x + y) * SIN30 - z)];
}

export function poly(points: Point3[]): string {
  return points.map(([x, y, z]) => iso(x, y, z).join(",")).join(" ");
}

/** Les trois faces visibles d'un pavé droit, dans l'ordre de peinture. */
export function faces(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number
): { top: string; left: string; right: string } {
  return {
    top: poly([
      [x, y, z + h],
      [x + w, y, z + h],
      [x + w, y + d, z + h],
      [x, y + d, z + h],
    ]),
    left: poly([
      [x, y + d, z],
      [x + w, y + d, z],
      [x + w, y + d, z + h],
      [x, y + d, z + h],
    ]),
    right: poly([
      [x + w, y, z],
      [x + w, y + d, z],
      [x + w, y + d, z + h],
      [x + w, y, z + h],
    ]),
  };
}

/** Segment vertical projeté : renvoie x, y1, y2 exploitables par un `<line>`. */
export function upright(x: number, y: number, zBottom: number, zTop: number) {
  const [cx, baseY] = iso(x, y, 0);
  return { x: cx, y1: round(baseY - zTop), y2: round(baseY - zBottom) };
}
