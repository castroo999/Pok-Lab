import axios from "axios";

import { regioes } from "../data/regioes.js";

type PokemonApiResponse = {
  id: number;

  name: string;

  types: {
    slot: number;

    type: {
      name: string;
      url: string;
    };
  }[];

  abilities: {
    is_hidden: boolean;
    slot: number;

    ability: {
      name: string;
      url: string;
    };
  }[];

  stats: {
    base_stat: number;
    effort: number;

    stat: {
      name: string;
      url: string;
    };
  }[];

  sprites: {
    other?: {
      showdown?: {
        front_default:
          | string
          | null;
      };
    };
  };

  moves: {
    move: {
      name: string;
      url: string;
    };

    version_group_details: {
      level_learned_at: number;

      move_learn_method: {
        name: string;
        url: string;
      };

      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
};

type DadosGolpeApi = {
  name: string;

  power: number | null;

  accuracy: number | null;

  damage_class: {
    name: string;
  };

  type: {
    name: string;
  };
};

type Golpe = {
  nome: string;
  tipo: string;
  poder: number;
  precisao: number;
  categoria: string;
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

export async function buscarPokemon(
  idOuNome: string,
) {
  const response =
    await axios.get<PokemonApiResponse>(
      `https://pokeapi.co/api/v2/pokemon/${idOuNome}`,
    );

  const pokemon =
    response.data;

  return {
    id: pokemon.id,

    name: pokemon.name,

    gif:
      pokemon.sprites.other
        ?.showdown
        ?.front_default ?? null,

    types: pokemon.types.map(
      (type) =>
        type.type.name,
    ),
  };
}

function calcularEfetividade(
  tipoGolpe: string,
) {
  const vantagens =
    VANTAGENS[tipoGolpe] ?? [];

  return vantagens.length;
}

function calcularPontuacaoGolpe(
  golpe: Golpe,
  tiposPokemon: string[],
  ataque: number,
  ataqueEspecial: number,
  tiposJaEscolhidos: string[],
) {
  let pontuacao = 0;

  const ehSTAB =
    tiposPokemon.includes(
      golpe.tipo,
    );

  if (ehSTAB) {
    pontuacao += 30;
  }

  const categoriaIdeal =
    ataque >= ataqueEspecial
      ? "physical"
      : "special";

  if (
    golpe.categoria ===
    categoriaIdeal
  ) {
    pontuacao += 20;
  } else {
    pontuacao -= 8;
  }

  const poder =
    Math.min(golpe.poder, 150);

  pontuacao +=
    (poder / 150) * 30;

  pontuacao +=
    (golpe.precisao / 100) * 10;

  const efetividade =
    calcularEfetividade(
      golpe.tipo,
    );

  pontuacao +=
    efetividade * 2;

  if (
    !tiposPokemon.includes(
      golpe.tipo,
    )
  ) {
    pontuacao += 10;
  }

  if (
    tiposJaEscolhidos.includes(
      golpe.tipo,
    )
  ) {
    pontuacao -= 15;
  }

  if (
    golpe.poder < 40
  ) {
    pontuacao -= 15;
  }

  if (
    golpe.precisao < 70
  ) {
    pontuacao -= 10;
  }

  return pontuacao;
}

function selecionarMelhoresGolpes(
  golpes: Golpe[],
  tiposPokemon: string[],
  ataque: number,
  ataqueEspecial: number,
) {
  const candidatos =
    golpes
      .filter(
        (golpe) =>
          golpe.categoria !==
          "status",
      )
      .filter(
        (golpe) =>
          golpe.poder > 0,
      );

  const selecionados: Golpe[] =
    [];

  while (
    selecionados.length < 4 &&
    candidatos.length > 0
  ) {
    let melhorGolpe:
      | Golpe
      | null = null;

    let melhorPontuacao =
      -Infinity;

    for (const golpe of candidatos) {
      const tiposJaEscolhidos =
        selecionados.map(
          (selecionado) =>
            selecionado.tipo,
        );

      const pontuacao =
        calcularPontuacaoGolpe(
          golpe,
          tiposPokemon,
          ataque,
          ataqueEspecial,
          tiposJaEscolhidos,
        );

      if (
        pontuacao >
        melhorPontuacao
      ) {
        melhorPontuacao =
          pontuacao;

        melhorGolpe =
          golpe;
      }
    }

    if (!melhorGolpe) {
      break;
    }

    selecionados.push(
      melhorGolpe,
    );

    const indice =
      candidatos.findIndex(
        (golpe) =>
          golpe.nome ===
          melhorGolpe?.nome,
      );

    if (indice !== -1) {
      candidatos.splice(
        indice,
        1,
      );
    }
  }

  return selecionados;
}

export async function buscarDadosPokemon(
  id: number,
  versionGroup?: string,
) {
  const response =
    await axios.get<PokemonApiResponse>(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );

  const pokemon =
    response.data;

  const tiposPokemon =
    pokemon.types.map(
      (type) =>
        type.type.name,
    );

  const ataque =
    pokemon.stats.find(
      (stat) =>
        stat.stat.name ===
        "attack",
    )?.base_stat ?? 0;

  const ataqueEspecial =
    pokemon.stats.find(
      (stat) =>
        stat.stat.name ===
        "special-attack",
    )?.base_stat ?? 0;

  const golpesDisponiveis =
    versionGroup
      ? pokemon.moves.filter(
          (item) =>
            item.version_group_details.some(
              (detalhe) =>
                detalhe
                  .version_group
                  .name ===
                versionGroup,
            ),
        )
      : pokemon.moves;

  const golpes =
    await Promise.all(
      golpesDisponiveis.map(
        async (item) => {
          try {
            const responseGolpe =
              await axios.get<DadosGolpeApi>(
                item.move.url,
              );

            const golpe =
              responseGolpe.data;

            return {
              nome: golpe.name,

              tipo:
                golpe.type.name,

              poder:
                golpe.power ?? 0,

              precisao:
                golpe.accuracy ??
                100,

              categoria:
                golpe
                  .damage_class
                  .name,
            };
          } catch {
            return null;
          }
        },
      ),
    );

  const golpesValidos =
    golpes.filter(
      (
        golpe,
      ): golpe is Golpe =>
        golpe !== null,
    );

  const melhoresGolpes =
    selecionarMelhoresGolpes(
      golpesValidos,
      tiposPokemon,
      ataque,
      ataqueEspecial,
    );

  return {
    id: pokemon.id,

    nome: pokemon.name,

    gif:
      pokemon.sprites.other
        ?.showdown
        ?.front_default ?? null,

    tipos: tiposPokemon,

    habilidades:
      pokemon.abilities.map(
        (ability) => ({
          nome:
            ability.ability
              .name,

          oculta:
            ability.is_hidden,
        }),
      ),

    stats:
      Object.fromEntries(
        pokemon.stats.map(
          (stat) => [
            stat.stat.name,
            stat.base_stat,
          ],
        ),
      ),

    golpes:
      melhoresGolpes,
  };
}

export async function buscarPokedex(
  offset: number,
  regiao?: string,
) {
  let novoOffset =
    offset;

  let limit = 30;

  if (regiao) {
    const dadosRegiao =
      regioes[
        regiao as keyof typeof regioes
      ];

    if (!dadosRegiao) {
      throw new Error(
        "Região não encontrada",
      );
    }

    const quantidade =
      dadosRegiao.fim -
      dadosRegiao.inicio +
      1;

    const restante =
      quantidade - offset;

    if (restante <= 0) {
      return [];
    }

    limit = Math.min(
      30,
      restante,
    );

    novoOffset =
      dadosRegiao.inicio -
      1 +
      offset;
  }

  const response =
    await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${novoOffset}&limit=${limit}`,
    );

  const resultados =
    response.data.results;

  const pokemons =
    await Promise.all(
      resultados.map(
        (pokemon: {
          name: string;
        }) =>
          buscarPokemon(
            pokemon.name,
          ),
      ),
    );

  return pokemons;
}