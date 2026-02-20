// src/domain/number.ts

function clampNonNegative(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

function parseFractionQuarter(text: string): number | null {
  // aceita "3/4", " 3 / 4 "
  const m = text.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!m) return null;

  const num = Number(m[1]);
  const den = Number(m[2]);

  if (!Number.isFinite(num) || !Number.isFinite(den)) return null;
  if (den !== 4) return null; // seu caso é sempre /4
  if (num < 0 || num > 3) return null;

  return num / den;
}

function parseWholePlusQuarter(text: string): number | null {
  // aceita:
  // "2 + 3/4"
  // "2+3/4"
  // "2 3/4" (convertido antes)
  const m = text.match(/^(\d+)\s*\+\s*(\d+)\s*\/\s*(\d+)$/);
  if (!m) return null;

  const whole = Number(m[1]);
  const num = Number(m[2]);
  const den = Number(m[3]);

  if (!Number.isFinite(whole) || !Number.isFinite(num) || !Number.isFinite(den)) return null;
  if (den !== 4) return null;
  if (num < 0 || num > 3) return null;

  return whole + num / den;
}

/**
 * Converte input de quantidade em número.
 *
 * Aceita:
 * - "2" | "2.75" | "2,75"
 * - "3/4"
 * - "2 + 3/4" | "2+3/4"
 * - "2 3/4" (atalho)
 */
export function parseDecimalInput(raw: string): number {
  if (!raw) return 0;

  const s0 = raw.trim();
  if (!s0) return 0;

  // Normaliza decimal PT-BR
  const s = s0.replace(",", ".").replace(/\s+/g, " ");

  // 1) "2 3/4" -> "2 + 3/4"
  const asPlus = s.replace(/^(\d+)\s+(\d+\s*\/\s*\d+)$/, "$1 + $2");

  // 2) tenta "2 + 3/4"
  const plus = parseWholePlusQuarter(asPlus);
  if (plus != null) return clampNonNegative(plus);

  // 3) tenta "3/4"
  const frac = parseFractionQuarter(asPlus);
  if (frac != null) return clampNonNegative(frac);

  // 4) fallback número normal
  const n = Number(asPlus);
  return clampNonNegative(n);
}