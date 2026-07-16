import type { Areal } from '../types/areal';

export function step1CanProceed(areal: Pick<Areal, 'nazov'>): boolean {
  return areal.nazov.trim().length > 0;
}
