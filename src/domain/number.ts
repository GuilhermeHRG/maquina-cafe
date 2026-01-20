export function parseDecimalInput(raw: string): number {
  // permite o usuário digitar vazio sem quebrar
  if (!raw?.trim()) return 0;

  // PT-BR: troca vírgula por ponto
  const normalized = raw.replace(",", ".");

  const n = Number(normalized);
  if (!Number.isFinite(n)) return 0;

  // impede negativo
  return Math.max(0, n);
}
