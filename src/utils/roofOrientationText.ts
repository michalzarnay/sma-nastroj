// Pri plochej streche (strechaTyp === 1) nemá orientácia zmysel – panely možno
// natočiť ľubovoľným smerom, preto sa má uviesť celá plocha strechy.
// Pri šikmej/strmej streche zostáva pôvodný význam – plocha orientovaná na J/JV/JZ.
export function getStrechaOrientovanaPlochaLabel(strechaTyp: 1 | 2 | 3): string {
  return strechaTyp === 1
    ? 'Využiteľná plocha strechy'
    : 'Využiteľná plocha strechy orient. na J/JV/JZ';
}

export function getStrechaOrientovanaPlochaTooltip(strechaTyp: 1 | 2 | 3): string {
  return strechaTyp === 1
    ? 'Strecha je plochá – uveďte celú využiteľnú plochu strechy. Panely na plochej streche možno natočiť do ľubovoľného smeru, orientácia strechy tu nie je rozhodujúca.'
    : 'Plocha strechy orientovaná na juh, juhovýchod alebo juhozápad, vhodná napr. na montáž solárnych panelov.';
}
