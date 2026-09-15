import axios from "axios";

import { pegarDoCache, salvarNoCache } from "./pokemonCache.js";

import { analisarProgresso } from "./progressoPokemon.js";

import type {
  PokemonEncounter,
  VersionEncounterDetail,
} from "../types/pokemonEncounterTypes.js";

import type {
  MetodoObtencao,
  PokemonAvailability,
} from "../types/pokemonDisponibilidadeTypes.js";

function identificarMetodo(metodo: string): MetodoObtencao {
  const nome = metodo.toLowerCase();

  if (nome.includes("fish")) {
    return "fishing";
  }

  if (nome.includes("surf")) {
    return "surf";
  }

  if (nome.includes("sos")) {
    return "sos";
  }

  return "selvagem";
}

async function buscarEncounters(pokemonId: number) {
  const cache = pegarDoCache(pokemonId);

  if (cache) {
    return cache;
  }

  const response = await axios.get<PokemonEncounter[]>(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`,
  );

  salvarNoCache(pokemonId, response.data);

  return response.data;
}

export async function verificarDisponibilidade(
  pokemonId: number,
  jogo: string,
): Promise<PokemonAvailability> {
  const encounters = await buscarEncounters(pokemonId);

  const locais = encounters.flatMap((encounter) => {
    const versao = encounter.version_details.find(
      (version: VersionEncounterDetail) => version.version.name === jogo,
    );

    if (!versao) {
      return [];
    }

    return versao.encounter_details.map((detalhe) => ({
      local: encounter.location_area.name,

      nivelMinimo: detalhe.min_level,

      nivelMaximo: detalhe.max_level,

      metodo: detalhe.method.name,

      chance: detalhe.chance,
    }));
  });

  if (locais.length === 0) {
    return {
      disponivel: false,

      metodo: "outro",

      primeiraDisponibilidade: null,

      jornada: {
        utilizavel: false,
        penalidade: 100,
        motivo: "Não possui encontro selvagem catalogado",
      },

      tempoEstimado: {
        valor: 0,
        unidade: "progresso",
      },

      locais: [],
    };
  }

  const locaisAnalisados = locais.map((local) => {
    const progresso = analisarProgresso(jogo, local.local);

    return {
      ...local,
      progresso,
    };
  });

  locaisAnalisados.sort(
    (a, b) => a.progresso.progresso - b.progresso.progresso,
  );

  const primeiro = locaisAnalisados[0];

  if (!primeiro) {
    throw new Error("Não foi possível determinar o primeiro local");
  }

  const metodo = identificarMetodo(primeiro.metodo);

  return {
    disponivel: true,

    metodo,

    primeiraDisponibilidade: {
      local: primeiro.local,

      nivelMinimo: primeiro.nivelMinimo,

      nivelMaximo: primeiro.nivelMaximo,

      fase: primeiro.progresso.fase,

      progresso: primeiro.progresso.progresso,
    },

    jornada: {
      utilizavel: primeiro.progresso.utilizavel,

      penalidade: primeiro.progresso.penalidade,

      motivo: primeiro.progresso.motivo,
    },

    tempoEstimado: {
      valor: primeiro.progresso.progresso,

      unidade: "progresso",
    },

    locais,
  };
}
