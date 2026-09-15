type PerfilJogo = {
  regiao: string;

  locaisPosJogo: string[];

  locaisFinais: string[];

  locaisMuitoCedo: string[];

  penalidadePosJogo: number;

  penalidadeFinal: number;
};

export const progressoJogos: Record<string, PerfilJogo> = {
  firered: {
    regiao: "kanto",

    locaisMuitoCedo: ["route-1", "route-2", "viridian-forest", "route-22"],

    locaisFinais: [
      "victory-road",
      "pokemon-league",
      "indigo-plateau",
      "cerulean-cave",
    ],

    locaisPosJogo: [
      "cerulean-cave",
      "one-island",
      "two-island",
      "three-island",
      "four-island",
      "five-island",
      "six-island",
      "seven-island",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  leafgreen: {
    regiao: "kanto",

    locaisMuitoCedo: ["route-1", "route-2", "viridian-forest", "route-22"],

    locaisFinais: [
      "victory-road",
      "pokemon-league",
      "indigo-plateau",
      "cerulean-cave",
    ],

    locaisPosJogo: [
      "cerulean-cave",
      "one-island",
      "two-island",
      "three-island",
      "four-island",
      "five-island",
      "six-island",
      "seven-island",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  emerald: {
    regiao: "hoenn",

    locaisMuitoCedo: ["route-101", "route-102", "route-103", "petalburg-woods"],

    locaisFinais: ["victory-road", "ever-grande-city", "pokemon-league"],

    locaisPosJogo: ["battle-frontier", "battle-tower", "sky-pillar"],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  diamond: {
    regiao: "sinnoh",

    locaisMuitoCedo: ["route-201", "route-202", "route-203", "oreburgh-gate"],

    locaisFinais: ["victory-road", "pokemon-league", "spear-pillar"],

    locaisPosJogo: [
      "battle-zone",
      "survival-area",
      "resort-area",
      "stark-mountain",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  pearl: {
    regiao: "sinnoh",

    locaisMuitoCedo: ["route-201", "route-202", "route-203", "oreburgh-gate"],

    locaisFinais: ["victory-road", "pokemon-league", "spear-pillar"],

    locaisPosJogo: [
      "battle-zone",
      "survival-area",
      "resort-area",
      "stark-mountain",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  platinum: {
    regiao: "sinnoh",

    locaisMuitoCedo: ["route-201", "route-202", "route-203", "oreburgh-gate"],

    locaisFinais: ["victory-road", "pokemon-league", "spear-pillar"],

    locaisPosJogo: [
      "battle-zone",
      "survival-area",
      "resort-area",
      "stark-mountain",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  heartgold: {
    regiao: "johto",

    locaisMuitoCedo: ["route-29", "route-30", "route-31", "dark-cave"],

    locaisFinais: ["victory-road", "pokemon-league", "mt-silver"],

    locaisPosJogo: ["mt-silver", "battle-frontier", "frontier-brain"],

    penalidadeFinal: 25,
    penalidadePosJogo: 95,
  },

  soulsilver: {
    regiao: "johto",

    locaisMuitoCedo: ["route-29", "route-30", "route-31", "dark-cave"],

    locaisFinais: ["victory-road", "pokemon-league", "mt-silver"],

    locaisPosJogo: ["mt-silver", "battle-frontier", "frontier-brain"],

    penalidadeFinal: 25,
    penalidadePosJogo: 95,
  },

  black: {
    regiao: "unova",

    locaisMuitoCedo: ["route-1", "route-2", "route-3", "dreamyard"],

    locaisFinais: ["victory-road", "pokemon-league", "giant-chasm"],

    locaisPosJogo: ["giant-chasm", "battle-subway", "p2-laboratory"],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  white: {
    regiao: "unova",

    locaisMuitoCedo: ["route-1", "route-2", "route-3", "dreamyard"],

    locaisFinais: ["victory-road", "pokemon-league", "giant-chasm"],

    locaisPosJogo: ["giant-chasm", "battle-subway", "p2-laboratory"],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  "black-2": {
    regiao: "unova",

    locaisMuitoCedo: ["route-19", "route-20", "floccesy-ranch"],

    locaisFinais: ["victory-road", "pokemon-league", "giant-chasm"],

    locaisPosJogo: [
      "black-tower",
      "white-treehollow",
      "battle-subway",
      "p2-laboratory",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 95,
  },

  "white-2": {
    regiao: "unova",

    locaisMuitoCedo: ["route-19", "route-20", "floccesy-ranch"],

    locaisFinais: ["victory-road", "pokemon-league", "giant-chasm"],

    locaisPosJogo: [
      "black-tower",
      "white-treehollow",
      "battle-subway",
      "p2-laboratory",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 95,
  },

  x: {
    regiao: "kalos",

    locaisMuitoCedo: ["route-1", "route-2", "route-3", "santalune-forest"],

    locaisFinais: ["victory-road", "pokemon-league", "kalos-route-21"],

    locaisPosJogo: ["terminus-cave", "battle-maison"],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  y: {
    regiao: "kalos",

    locaisMuitoCedo: ["route-1", "route-2", "route-3", "santalune-forest"],

    locaisFinais: ["victory-road", "pokemon-league", "kalos-route-21"],

    locaisPosJogo: ["terminus-cave", "battle-maison"],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  "omega-ruby": {
    regiao: "hoenn",

    locaisMuitoCedo: ["route-101", "route-102", "route-103", "petalburg-woods"],

    locaisFinais: ["victory-road", "ever-grande-city", "pokemon-league"],

    locaisPosJogo: [
      "battle-resort",
      "mirage-mountain",
      "mirage-cave",
      "mirage-island",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  "alpha-sapphire": {
    regiao: "hoenn",

    locaisMuitoCedo: ["route-101", "route-102", "route-103", "petalburg-woods"],

    locaisFinais: ["victory-road", "ever-grande-city", "pokemon-league"],

    locaisPosJogo: [
      "battle-resort",
      "mirage-mountain",
      "mirage-cave",
      "mirage-island",
    ],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  sun: {
    regiao: "alola",

    locaisMuitoCedo: ["route-1", "hauoli-city", "route-2", "melemele-meadow"],

    locaisFinais: ["victory-road", "pokemon-league", "mount-lanakila"],

    locaisPosJogo: ["ultra-space-wilds", "battle-tree"],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  moon: {
    regiao: "alola",

    locaisMuitoCedo: ["route-1", "hauoli-city", "route-2", "melemele-meadow"],

    locaisFinais: ["victory-road", "pokemon-league", "mount-lanakila"],

    locaisPosJogo: ["ultra-space-wilds", "battle-tree"],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  "ultra-sun": {
    regiao: "alola",

    locaisMuitoCedo: ["route-1", "hauoli-city", "route-2", "melemele-meadow"],

    locaisFinais: [
      "victory-road",
      "pokemon-league",
      "mount-lanakila",
      "altar-of-the-sunne",
      "altar-of-the-moone",
    ],

    locaisPosJogo: ["ultra-space-wilds", "battle-tree", "aether-paradise"],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  "ultra-moon": {
    regiao: "alola",

    locaisMuitoCedo: ["route-1", "hauoli-city", "route-2", "melemele-meadow"],

    locaisFinais: [
      "victory-road",
      "pokemon-league",
      "mount-lanakila",
      "altar-of-the-sunne",
      "altar-of-the-moone",
    ],

    locaisPosJogo: ["ultra-space-wilds", "battle-tree", "aether-paradise"],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  sword: {
    regiao: "galar",

    locaisMuitoCedo: ["route-1", "route-2", "galar-mine"],

    locaisFinais: ["route-10", "slumbering-weald", "pokemon-league"],

    locaisPosJogo: ["battle-tower", "crown-tundra", "max-lair"],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  shield: {
    regiao: "galar",

    locaisMuitoCedo: ["route-1", "route-2", "galar-mine"],

    locaisFinais: ["route-10", "slumbering-weald", "pokemon-league"],

    locaisPosJogo: ["battle-tower", "crown-tundra", "max-lair"],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  "legends-arceus": {
    regiao: "hisui",

    locaisMuitoCedo: [
      "obsidian-fieldlands",
      "horseshoe-plains",
      "deertrack-heights",
    ],

    locaisFinais: ["temple-of-sinnoh", "coronet-highlands", "ancient-retreat"],

    locaisPosJogo: ["ancient-retreat", "spear-pillar", "distortion-world"],

    penalidadeFinal: 25,
    penalidadePosJogo: 90,
  },

  scarlet: {
    regiao: "paldea",

    locaisMuitoCedo: [
      "south-province-area-one",
      "south-province-area-two",
      "los-platos",
    ],

    locaisFinais: ["area-zero", "great-crater-of-paldea", "pokemon-league"],

    locaisPosJogo: [
      "area-zero",
      "north-province-area-zero",
      "academy-ace-tournament",
    ],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },

  violet: {
    regiao: "paldea",

    locaisMuitoCedo: [
      "south-province-area-one",
      "south-province-area-two",
      "los-platos",
    ],

    locaisFinais: ["area-zero", "great-crater-of-paldea", "pokemon-league"],

    locaisPosJogo: [
      "area-zero",
      "north-province-area-zero",
      "academy-ace-tournament",
    ],

    penalidadeFinal: 30,
    penalidadePosJogo: 100,
  },
};
