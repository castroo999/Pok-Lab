import axios from "axios";

import {
  pegarDoCache,
  salvarNoCache,
} from "./pokemonCache.js";

import type {
  PokemonEncounter,
  VersionEncounterDetail,
} from "../types/pokemonEncounterTypes.js";

export type PokemonAvailability = {
  disponivel: boolean;

  locais: {
    local: string;
    nivelMinimo: number;
    nivelMaximo: number;
    metodo: string;
    chance: number;
  }[];
};

async function buscarEncounters(
  pokemonId: number,
) {
  const cache =
    pegarDoCache(pokemonId);

  if (cache) {
    return cache;
  }

  const response =
    await axios.get<PokemonEncounter[]>(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`,
    );

  salvarNoCache(
    pokemonId,
    response.data,
  );

  return response.data;
}

export async function verificarDisponibilidade(
  pokemonId: number,
  jogo: string,
): Promise<PokemonAvailability> {
  const encounters =
    await buscarEncounters(pokemonId);

  const locais = encounters.flatMap(
    (encounter) => {
      const versao =
        encounter.version_details.find(
          (
            version: VersionEncounterDetail,
          ) =>
            version.version.name ===
            jogo,
        );

      if (!versao) {
        return [];
      }

      return versao.encounter_details.map(
        (detalhe) => ({
          local:
            encounter.location_area
              .name,

          nivelMinimo:
            detalhe.min_level,

          nivelMaximo:
            detalhe.max_level,

          metodo:
            detalhe.method.name,

          chance:
            detalhe.chance,
        }),
      );
    },
  );

  return {
    disponivel:
      locais.length > 0,

    locais,
  };
}