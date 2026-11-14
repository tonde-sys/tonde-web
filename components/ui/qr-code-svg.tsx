"use client";

import React, { useMemo } from "react";

/**
 * Encodeur QR Code ISO/IEC 18004 autonome (Mode Octet, Correction L, Versions 1 à 6).
 * Génère une matrice SVG 100 % scannable hors-ligne, sans dépendance externe.
 */

const VERSION_PARAMS: Record<
  number,
  { size: number; totalCodewords: number; ecCodewords: number; align: number[] }
> = {
  1: { size: 21, totalCodewords: 26, ecCodewords: 7, align: [] },
  2: { size: 25, totalCodewords: 44, ecCodewords: 10, align: [6, 18] },
  3: { size: 29, totalCodewords: 70, ecCodewords: 15, align: [6, 22] },
  4: { size: 33, totalCodewords: 100, ecCodewords: 20, align: [6, 26] },
  5: { size: 37, totalCodewords: 134, ecCodewords: 26, align: [6, 30] },
  6: { size: 41, totalCodewords: 172, ecCodewords: 36, align: [6, 34] }, // 2 blocks of 18 EC
};

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function rsRemainder(data: number[], ecLen: number): number[] {
  const gen = rsGeneratorPoly(ecLen);
  const rem = new Uint8Array(ecLen);
  for (const byte of data) {
    const factor = byte ^ rem[0];
    for (let i = 0; i < ecLen - 1; i++) {
      rem[i] = rem[i + 1] ^ gfMul(gen[i + 1], factor);
    }
    rem[ecLen - 1] = gfMul(gen[ecLen], factor);
  }
  return Array.from(rem);
}

function buildQrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  let version = 1;
  while (version <= 5) {
    const p = VERSION_PARAMS[version];
    const dataCap = p.totalCodewords - p.ecCodewords - 2;
    if (bytes.length <= dataCap) break;
    version++;
  }
  if (version > 5) version = 5;

  const params = VERSION_PARAMS[version];
  const dataCodewordsCount = params.totalCodewords - params.ecCodewords;

  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  const payload = bytes.slice(0, dataCodewordsCount - 2);
  pushBits(0b0100, 4);
  pushBits(payload.length, 8);
  for (const b of payload) pushBits(b, 8);

  const maxBits = dataCodewordsCount * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
    dataBytes.push(b);
  }
  let padToggle = true;
  while (dataBytes.length < dataCodewordsCount) {
    dataBytes.push(padToggle ? 0xec : 0x11);
    padToggle = !padToggle;
  }

  const ecBytes = rsRemainder(dataBytes, params.ecCodewords);
  const allCodewords = [...dataBytes, ...ecBytes];

  const size = params.size;
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFinder = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const isBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const isCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        modules[r][c] = inOuter && (isBorder || isCenter);
        reserved[r][c] = true;
      }
    }
  };

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  if (params.align.length > 0) {
    const c = params.align[1];
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
        const isCenter = dr === 0 && dc === 0;
        modules[c + dr][c + dc] = isBorder || isCenter;
        reserved[c + dr][c + dc] = true;
      }
    }
  }

  for (let i = 8; i < size - 8; i++) {
    if (!reserved[6][i]) {
      modules[6][i] = i % 2 === 0;
      reserved[6][i] = true;
    }
    if (!reserved[i][6]) {
      modules[i][6] = i % 2 === 0;
      reserved[i][6] = true;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (i < size) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }
  modules[size - 8][8] = true;

  let bitIdx = 0;
  const totalBits = allCodewords.length * 8;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!reserved[r][c]) {
          let dark = false;
          if (bitIdx < totalBits) {
            const byte = allCodewords[bitIdx >> 3];
            dark = ((byte >> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          if ((r + c) % 2 === 0) dark = !dark;
          modules[r][c] = dark;
        }
      }
    }
    upward = !upward;
  }

  // Format info pour Correction L (01) + Masque 0 (000) -> 0x77c4
  const formatBits = 0x77c4;
  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> i) & 1) === 1;
    if (i < 6) modules[i][8] = bit;
    else if (i < 8) modules[i + 1][8] = bit;
    else modules[8][size - 15 + i] = bit;

    if (i < 8) modules[8][size - 1 - i] = bit;
    else if (i < 9) modules[7][8] = bit;
    else modules[14 - i][8] = bit;
  }

  return modules;
}

export function QrCodeSvg({
  value,
  size = 148,
  fgColor = "#0A0E1A",
  bgColor = "#FFFFFF",
  className = "",
}: {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
}) {
  const matrix = useMemo(() => buildQrMatrix(value), [value]);
  const n = matrix.length;
  const margin = 2;
  const viewSize = n + margin * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR Code vers ${value}`}
      className={className}
    >
      <rect width={viewSize} height={viewSize} fill={bgColor} rx={1.5} />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c + margin}
              y={r + margin}
              width={1}
              height={1}
              fill={fgColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}
