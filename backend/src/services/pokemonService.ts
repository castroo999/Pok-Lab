import axios from "axios";

export async function buscarPokemon(idOuNome: string) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${idOuNome}`
  );

  const pokemon = response.data;

  return {
    id: pokemon.id,
    name: pokemon.name,
    gif: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`,
    types: pokemon.types.map(
      (type: { type: { name: string } }) => type.type.name
    ),
  };
}

// busca a lista de pokemons da pokedex de 30 em 30 pokemons
export async function buscarPokedex(offset: number) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=30`
  );

  const resultados = response.data.results;

  const pokemons = await Promise.all(
    resultados.map((pokemon: { name: string }) =>
      buscarPokemon(pokemon.name)
    )
  );

  return pokemons;
}