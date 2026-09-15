export const regioes = {
  kanto: {
    inicio: 1,
    fim: 151,
  },

  johto: {
    inicio: 152,
    fim: 251,
  },

  hoenn: {
    inicio: 252,
    fim: 386,
  },

  sinnoh: {
    inicio:  387,
    fim: 493,
  },

  unova: {
    inicio:494,
    fim: 649,
  },

  kalos: {
    inicio: 650,
    fim: 721,
  },

  alola: {
    inicio: 722,
    fim: 809,
  },

  galar: {
    inicio: 810,
    fim: 905,
  },

  paldea: {
    inicio: 906,
    fim: 1025
  }

};

export function descobrirRegiaoPokemon(id: number) {
  if (id >= 1 && id <= 151) return "kanto";
  if (id >= 152 && id <= 251) return "johto";
  if (id >= 252 && id <= 386) return "hoenn";
  if (id >= 387 && id <= 493) return "sinnoh";
  if (id >= 494 && id <= 649) return "unova";
  if (id >= 650 && id <= 721) return "kalos";
  if (id >= 722 && id <= 809) return "alola";
  if (id >= 810 && id <= 905) return "galar";
  if (id >= 906 && id <= 1025) return "paldea";

  return null;
}