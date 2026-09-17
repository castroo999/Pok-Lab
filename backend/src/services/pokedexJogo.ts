import axios from "axios";

type VersionGroupResponse = {
  pokedexes: {
    name: string;
    url: string;
  }[];
};

type PokedexResponse = {
  pokemon_entries: {
    entry_number: number;
    pokemon_species: {
      name: string;
      url: string;
    };
  }[];
};

export async function buscarPokemonDoJogo(
  versionGroup: string,
) {
  const response =
    await axios.get<VersionGroupResponse>(
      `https://pokeapi.co/api/v2/version-group/${versionGroup}`,
    );

  const pokedexes =
    response.data.pokedexes;

  const pokedexesUnicos =
    Array.from(
      new Map(
        pokedexes.map((pokedex) => [
          pokedex.url,
          pokedex,
        ]),
      ).values(),
    );

  const respostas =
    await Promise.all(
      pokedexesUnicos.map(
        async (pokedex) => {
          const responsePokedex =
            await axios.get<PokedexResponse>(
              pokedex.url,
            );

          return responsePokedex
            .data.pokemon_entries;
        },
      ),
    );

  const ids = respostas
    .flat()
    .map((entry) => {
      const partes =
        entry.pokemon_species.url
          .split("/")
          .filter(Boolean);

      return Number(
        partes[partes.length - 1],
      );
    })
    .filter(
      (id) => Number.isInteger(id),
    );

  return Array.from(
    new Set(ids),
  ).sort((a, b) => a - b);
}