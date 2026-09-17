import { descobrirRegiaoPokemon } from "../data/regioes.js";

export type PokemonPontuado = {
  id: number;

  nome: string;

  gif: string | null;

  tipos: string[];

  habilidades: {
    nome: string;
    oculta: boolean;
  }[];

  stats: Record<
    string,
    number
  >;

  golpes: {
    nome: string;
    tipo: string;
    poder: number;
    precisao: number;
    categoria: string;
  }[];

  pontuacao: number;
};

const VANTAGENS: Record<
  string,
  string[]
> = {
  normal: [],

  fire: [
    "grass",
    "ice",
    "bug",
    "steel",
  ],

  water: [
    "fire",
    "ground",
    "rock",
  ],

  electric: [
    "water",
    "flying",
  ],

  grass: [
    "water",
    "ground",
    "rock",
  ],

  ice: [
    "grass",
    "ground",
    "flying",
    "dragon",
  ],

  fighting: [
    "normal",
    "ice",
    "rock",
    "dark",
    "steel",
  ],

  poison: [
    "grass",
    "fairy",
  ],

  ground: [
    "fire",
    "electric",
    "poison",
    "rock",
    "steel",
  ],

  flying: [
    "grass",
    "fighting",
    "bug",
  ],

  psychic: [
    "fighting",
    "poison",
  ],

  bug: [
    "grass",
    "psychic",
    "dark",
  ],

  rock: [
    "fire",
    "ice",
    "flying",
    "bug",
  ],

  ghost: [
    "psychic",
    "ghost",
  ],

  dragon: [
    "dragon",
  ],

  dark: [
    "psychic",
    "ghost",
  ],

  steel: [
    "ice",
    "rock",
    "fairy",
  ],

  fairy: [
    "fighting",
    "dragon",
    "dark",
  ],
};

export function pontuarPokemon(
  pokemon: {
    id: number;

    nome: string;

    gif: string | null;

    tipos: string[];

    habilidades: {
      nome: string;
      oculta: boolean;
    }[];

    stats: Record<
      string,
      number
    >;

    golpes: {
      nome: string;
      tipo: string;
      poder: number;
      precisao: number;
      categoria: string;
    }[];
  },

  objetivo: string,

  regiaoJogo: string,

  disponibilidade?: {
    disponivel: boolean;

    locais: {
      local: string;
      nivelMinimo: number;
      nivelMaximo: number;
      metodo: string;
      chance: number;
    }[];
  },
): PokemonPontuado {
  const hp =
    pokemon.stats.hp ?? 0;

  const ataque =
    pokemon.stats.attack ?? 0;

  const defesa =
    pokemon.stats.defense ?? 0;

  const ataqueEspecial =
    pokemon.stats[
      "special-attack"
    ] ?? 0;

  const defesaEspecial =
    pokemon.stats[
      "special-defense"
    ] ?? 0;

  const velocidade =
    pokemon.stats.speed ?? 0;

  const totalStats =
    hp +
    ataque +
    defesa +
    ataqueEspecial +
    defesaEspecial +
    velocidade;

  const regiaoPokemon =
    descobrirRegiaoPokemon(
      pokemon.id,
    );

  let bonusRegional = 0;

  if (
    regiaoPokemon ===
    regiaoJogo
  ) {
    bonusRegional = 20;
  }

  let pontuacao = 0;

  if (
    objetivo ===
    "speedrun"
  ) {
    pontuacao =
      totalStats * 0.3 +
      velocidade * 0.8 +
      ataque * 0.5 +
      ataqueEspecial * 0.5;
  } else if (
    objetivo ===
    "platinar"
  ) {
    pontuacao =
      totalStats * 0.6 +
      hp * 0.2 +
      defesa * 0.2 +
      defesaEspecial * 0.2;
  } else if (
    objetivo ===
    "otimizacao"
  ) {
    pontuacao =
      totalStats * 0.7 +
      velocidade * 0.3 +
      ataque * 0.3 +
      ataqueEspecial * 0.3;
  } else if (
    objetivo ===
    "aleatorio"
  ) {
    pontuacao =
      Math.random() * 100;
  } else {
    pontuacao =
      totalStats * 0.5;
  }

  pontuacao +=
    bonusRegional;

  if (
    disponibilidade &&
    !disponibilidade.disponivel
  ) {
    pontuacao -= 100;
  }

  if (
    disponibilidade?.locais.length
  ) {
    pontuacao += Math.min(
      disponibilidade.locais.length,
      3,
    );
  }

  return {
    id: pokemon.id,

    nome: pokemon.nome,

    gif: pokemon.gif,

    tipos: pokemon.tipos,

    habilidades:
      pokemon.habilidades,

    stats: pokemon.stats,

    golpes: pokemon.golpes,

    pontuacao:
      Math.max(
        0,
        Math.round(
          pontuacao,
        ),
      ),
  };
}

function calcularCobertura(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const tiposDoTime =
    new Set<string>();

  for (
    const membro of time
  ) {
    for (
      const tipo of membro.tipos
    ) {
      tiposDoTime.add(
        tipo,
      );
    }
  }

  let cobertura = 0;

  for (
    const tipo of pokemon.tipos
  ) {
    const vantagens =
      VANTAGENS[tipo] ?? [];

    for (
      const tipoAlvo of vantagens
    ) {
      if (
        !tiposDoTime.has(
          tipoAlvo,
        )
      ) {
        cobertura++;
      }
    }
  }

  return cobertura;
}

function calcularDiversidade(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const tiposDoTime =
    new Set(
      time.flatMap(
        (membro) =>
          membro.tipos,
      ),
    );

  const novosTipos =
    pokemon.tipos.filter(
      (tipo) =>
        !tiposDoTime.has(
          tipo,
        ),
    );

  return novosTipos.length;
}

function calcularEquilibrio(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const ataque =
    pokemon.stats.attack ?? 0;

  const ataqueEspecial =
    pokemon.stats[
      "special-attack"
    ] ?? 0;

  const fisico =
    ataque >= ataqueEspecial;

  const fisicos =
    time.filter(
      (membro) =>
        (membro.stats.attack ??
          0) >=
        (membro.stats[
          "special-attack"
        ] ?? 0),
    ).length;

  const especiais =
    time.length -
    fisicos;

  if (
    fisico &&
    fisicos < 3
  ) {
    return 10;
  }

  if (
    !fisico &&
    especiais < 3
  ) {
    return 10;
  }

  return 0;
}

export function pontuarCandidato(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const cobertura =
    calcularCobertura(
      pokemon,
      time,
    );

  const diversidade =
    calcularDiversidade(
      pokemon,
      time,
    );

  const equilibrio =
    calcularEquilibrio(
      pokemon,
      time,
    );

  return (
    pokemon.pontuacao +
    cobertura * 4 +
    diversidade * 8 +
    equilibrio
  );
}