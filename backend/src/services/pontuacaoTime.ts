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

  stats: Record<string, number>;

  pontuacao: number;
};

const VANTAGENS: Record<string, string[]> = {
  normal: [],

  fire: ["grass", "ice", "bug", "steel"],

  water: ["fire", "ground", "rock"],

  electric: ["water", "flying"],

  grass: ["water", "ground", "rock"],

  ice: ["grass", "ground", "flying", "dragon"],

  fighting: ["normal", "ice", "rock", "dark", "steel"],

  poison: ["grass", "fairy"],

  ground: ["fire", "electric", "poison", "rock", "steel"],

  flying: ["grass", "fighting", "bug"],

  psychic: ["fighting", "poison"],

  bug: ["grass", "psychic", "dark"],

  rock: ["fire", "ice", "flying", "bug"],

  ghost: ["psychic", "ghost"],

  dragon: ["dragon"],

  dark: ["psychic", "ghost"],

  steel: ["ice", "rock", "fairy"],

  fairy: ["fighting", "dragon", "dark"],
};

/*
  Pontuação individual do Pokémon.

  Aqui avaliamos o Pokémon sozinho.

  Depois, no timesAleatorios.ts,
  avaliamos como ele funciona junto
  com os outros membros do time.
*/

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
    stats: Record<string, number>;
  },
  objetivo: string,
  regiaoJogo: string,
  disponibilidade?: {
    jornada: {
      utilizavel: boolean;
      penalidade: number;
    };
    primeiraDisponibilidade: {
      progresso: number;
    } | null;
    tempoEstimado: {
      valor: number;
    };
  },
): PokemonPontuado {
  const hp = pokemon.stats.hp ?? 0;

  const ataque = pokemon.stats.attack ?? 0;

  const defesa = pokemon.stats.defense ?? 0;

  const ataqueEspecial = pokemon.stats["special-attack"] ?? 0;

  const defesaEspecial = pokemon.stats["special-defense"] ?? 0;

  const velocidade = pokemon.stats.speed ?? 0;

  const totalStats =
    hp + ataque + defesa + ataqueEspecial + defesaEspecial + velocidade;

  /*
    Descobre a região de origem
    do Pokémon.
  */

  const regiaoPokemon = descobrirRegiaoPokemon(pokemon.id);

  /*
    Pokémon da região do jogo
    recebem preferência.
  */

  let bonusRegional = 0;

  if (regiaoPokemon === regiaoJogo) {
    bonusRegional = 20;
  }

  /*
    Pontuação baseada no objetivo.
  */

  let pontuacao: number;

  if (objetivo === "speedrun") {
    pontuacao =
      totalStats * 0.3 + velocidade * 0.8 + ataque * 0.5 + ataqueEspecial * 0.5;
  } else if (objetivo === "platinar") {
    pontuacao =
      totalStats * 0.6 + hp * 0.2 + defesa * 0.2 + defesaEspecial * 0.2;
  } else if (objetivo === "otimizacao") {
    pontuacao =
      totalStats * 0.7 + velocidade * 0.3 + ataque * 0.3 + ataqueEspecial * 0.3;
  } else if (objetivo === "aleatorio") {
    pontuacao = Math.random() * 100;
  } else {
    pontuacao = totalStats * 0.5;
  }

  /*
    Bônus regional.
  */

  pontuacao += bonusRegional;

  /*
    Penalização de disponibilidade.
  */

  if (disponibilidade) {
    const penalidade = calcularPenalidadeDisponibilidade(disponibilidade);

    pontuacao -= penalidade;
  }

  return {
    id: pokemon.id,
    nome: pokemon.nome,
    gif: pokemon.gif,
    tipos: pokemon.tipos,
    habilidades: pokemon.habilidades,
    stats: pokemon.stats,

    pontuacao: Math.max(0, Math.round(pontuacao)),
  };
}

/*
  Avalia quanto um Pokémon
  complementa um time existente.
*/

function calcularCobertura(pokemon: PokemonPontuado, time: PokemonPontuado[]) {
  const tiposDoTime = new Set<string>();

  for (const membro of time) {
    for (const tipo of membro.tipos) {
      tiposDoTime.add(tipo);
    }
  }

  let cobertura = 0;

  for (const tipo of pokemon.tipos) {
    const vantagens = VANTAGENS[tipo] ?? [];

    for (const tipoAlvo of vantagens) {
      if (!tiposDoTime.has(tipoAlvo)) {
        cobertura++;
      }
    }
  }

  return cobertura;
}

/*
  Verifica se o Pokémon
  adiciona tipos novos ao time.
*/

function calcularDiversidade(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const tiposDoTime = new Set(time.flatMap((membro) => membro.tipos));

  const novosTipos = pokemon.tipos.filter((tipo) => !tiposDoTime.has(tipo));

  return novosTipos.length;
}

/*
  Tenta equilibrar Pokémon
  físicos e especiais.
*/

function calcularEquilibrio(pokemon: PokemonPontuado, time: PokemonPontuado[]) {
  const ataque = pokemon.stats.attack ?? 0;

  const ataqueEspecial = pokemon.stats["special-attack"] ?? 0;

  const fisico = ataque >= ataqueEspecial;

  const fisicos = time.filter(
    (membro) =>
      (membro.stats.attack ?? 0) >= (membro.stats["special-attack"] ?? 0),
  ).length;

  const especiais = time.length - fisicos;

  /*
    Se ainda temos poucos
    Pokémon físicos, damos
    preferência a um físico.
  */

  if (fisico && fisicos < 3) {
    return 10;
  }

  /*
    Se ainda temos poucos
    Pokémon especiais, damos
    preferência a um especial.
  */

  if (!fisico && especiais < 3) {
    return 10;
  }

  return 0;
}

/*
  Pontuação usada pelo
  algoritmo de montagem do time.

  Aqui o Pokémon deixa de ser
  avaliado sozinho e passa a ser
  avaliado em relação ao time.
*/

export function pontuarCandidato(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const cobertura = calcularCobertura(pokemon, time);

  const diversidade = calcularDiversidade(pokemon, time);

  const equilibrio = calcularEquilibrio(pokemon, time);

  return pokemon.pontuacao + cobertura * 4 + diversidade * 8 + equilibrio;
}

/*
  Calcula a penalidade relacionada
  à disponibilidade do Pokémon.

  Quanto mais tarde o Pokémon
  aparece, menor será sua pontuação
  para uma equipe de campanha.
*/

function calcularPenalidadeDisponibilidade(disponibilidade: {
  jornada: {
    utilizavel: boolean;
    penalidade: number;
  };

  primeiraDisponibilidade: {
    progresso: number;
  } | null;

  tempoEstimado: {
    valor: number;
  };
}) {
  let penalidade = 0;

  /*
    Se não pode ser utilizado
    durante a jornada, recebe
    uma penalidade muito grande.
  */

  if (!disponibilidade.jornada.utilizavel) {
    penalidade += 100;
  }

  /*
    Penalidade definida pelo
    progresso do jogo.
  */

  penalidade += disponibilidade.jornada.penalidade;

  /*
    Quanto mais tarde aparece,
    maior a penalização.
  */

  if (disponibilidade.primeiraDisponibilidade) {
    penalidade += disponibilidade.primeiraDisponibilidade.progresso * 0.5;
  }

  /*
    Penalização adicional
    pelo tempo estimado.
  */

  penalidade += disponibilidade.tempoEstimado.valor * 0.25;

  return penalidade;
}
