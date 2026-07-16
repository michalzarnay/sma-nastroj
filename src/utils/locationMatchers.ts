import { KRAJE, OKRESY_BY_KRAJ } from '../data/slovakLocations';

export function matchKraj(raw: string): string {
  if (!raw) return '';
  const norm = raw.trim();
  const exact = KRAJE.find(k => k.toLowerCase() === norm.toLowerCase());
  if (exact) return exact;
  return KRAJE.find(k => norm.toLowerCase().includes(k.split(' ')[0].toLowerCase())) ?? '';
}

export function matchOkres(raw: string, kraj: string): string {
  if (!raw) return '';
  const stripped = raw.replace(/^[Oo]kres\s+/, '').trim();
  const pool = kraj ? (OKRESY_BY_KRAJ[kraj] ?? []) : Object.values(OKRESY_BY_KRAJ).flat();
  return pool.find(o => o.toLowerCase() === stripped.toLowerCase())
    ?? pool.find(o => stripped.toLowerCase().includes(o.toLowerCase()))
    ?? '';
}
