export type OpatrenieKategoria = 'MZI' | 'OZE' | 'ENERGETIKA';
export type Narocnost = 'nízka' | 'stredná' | 'vysoká';
export type Priorita = 'vysoká' | 'stredná' | 'nízka';

export interface Opatrenie {
  id: string;
  nazov: string;
  kategoria: OpatrenieKategoria;
  popis: string;
  benefity: string[];
  narocnostRealizacie: Narocnost;
  orientacnaCena: string;
  navratnost: string;
  vhodnePre: string[];
  krokyRealizacie: string[];
  dotacie: string;
  priorita?: Priorita;
  potencial?: string;
}

export interface Odporucanie {
  opatrenie: Opatrenie;
  priorita: Priorita;
  dovod: string;
  potencial?: string;
}
