import axios from "axios";

type ApiResource = {
  name: string;
  url: string;
};

type VersionGroupResponse = {
  name: string;

  pokedexes: ApiResource[];
};

type PokedexResponse = {
  name: string;

  pokemon_entries: {
    entry_number: number;

    pokemon_species: ApiResource;
  }[];
};

const cachePokedex = new Map<string, number[]>();

/*
  Descobre todos os Pokémon catalogados
  nas Pokédexes daquele grupo de versões.
*/

export async function buscarPokemonDoJogo(versionGroup: string) {
  const cache = cachePokedex.get(versionGroup);

  if (cache) {
    return cache;
  }

  /*
    Primeiro descobrimos quais Pokédexes
    pertencem ao grupo de versões.
  */

  const response = await axios.get<VersionGroupResponse>(
    `https://pokeapi.co/api/v2/version-group/${versionGroup}`,
  );

  const pokedexes = response.data.pokedexes;

  /*
    Buscamos todas as Pokédexes
    daquele grupo.
  */

  const dadosPokedex = await Promise.all(
    pokedexes.map(async (pokedex) => {
      const response = await axios.get<PokedexResponse>(pokedex.url);

      return response.data;
    }),
  );

  /*
    Junta todos os Pokémon.
  */

  const ids = dadosPokedex.flatMap((pokedex) =>
    pokedex.pokemon_entries.map((entry) =>
      Number(entry.pokemon_species.url.split("/").filter(Boolean).pop()),
    ),
  );

  /*
    Remove IDs duplicados.

    Isso é importante porque um Pokémon
    pode aparecer em mais de uma Pokédex.
  */

  const idsUnicos = [...new Set(ids)];

  /*
    Guarda no cache.

    Se o usuário pedir Shield novamente,
    não precisamos consultar as Pokédexes
    outra vez.
  */

  cachePokedex.set(versionGroup, idsUnicos);

  return idsUnicos;
}
