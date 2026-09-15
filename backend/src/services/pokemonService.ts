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
        front_default: string | null;
      };
    };
  };
};

export async function buscarPokemon(idOuNome: string) {
  const response = await axios.get<PokemonApiResponse>(
    `https://pokeapi.co/api/v2/pokemon/${idOuNome}`,
  );

  const pokemon = response.data;

  return {
    id: pokemon.id,

    name: pokemon.name,

    gif:
      pokemon.sprites.other?.showdown?.front_default ??
      null,

    types: pokemon.types.map(
      (type) => type.type.name,
    ),
  };
}

export async function buscarDadosPokemon(id: number) {
  const response = await axios.get<PokemonApiResponse>(
    `https://pokeapi.co/api/v2/pokemon/${id}`,
  );

  const pokemon = response.data;

  return {
    id: pokemon.id,

    nome: pokemon.name,

    gif:
      pokemon.sprites.other?.showdown?.front_default ??
      null,

    tipos: pokemon.types.map(
      (type) => type.type.name,
    ),

    habilidades: pokemon.abilities.map(
      (ability) => ({
        nome: ability.ability.name,
        oculta: ability.is_hidden,
      }),
    ),

    stats: Object.fromEntries(
      pokemon.stats.map(
        (stat) => [
          stat.stat.name,
          stat.base_stat,
        ],
      ),
    ),
  };
}

export async function buscarPokedex(
  offset: number,
  regiao?: string,
) {
  let novoOffset = offset;

  let limit = 30;

  if (regiao) {
    const dadosRegiao =
      regioes[
        regiao as keyof typeof regioes
      ];

    if (!dadosRegiao) {
      throw new Error("Região não encontrada");
    }

    const quantidade =
      dadosRegiao.fim -
      dadosRegiao.inicio +
      1;

    const restante =
      quantidade - offset;

    limit = Math.min(
      30,
      restante,
    );

    novoOffset =
      dadosRegiao.inicio -
      1 +
      offset;
  }

  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?offset=${novoOffset}&limit=${limit}`,
  );

  const resultados =
    response.data.results;

  const pokemons =
    await Promise.all(
      resultados.map(
        (pokemon: { name: string }) =>
          buscarPokemon(
            pokemon.name,
          ),
      ),
    );

  return pokemons;
}