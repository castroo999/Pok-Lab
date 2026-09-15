import axios from "axios";
import { regioes } from "../data/regioes.js";

export async function buscarPokemon(idOuNome: string) {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${idOuNome}`,
  );

  const pokemon = response.data;

  return {
    id: pokemon.id,
    name: pokemon.name,
    gif: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`,
    types: pokemon.types.map(
      (type: { type: { name: string } }) => type.type.name,
    ),
  };
}

// busca a lista de pokemons da pokedex de 30 em 30 pokemons
export async function buscarPokedex(offset: number, regiao?: string) {
  let novoOffset = offset;
  let limit = 30;

  if (regiao) {
    const dadosRegiao = regioes[regiao as keyof typeof regioes];

    if (!dadosRegiao) {
      throw new Error("Região não encontrada");
    }

    const quantidade = dadosRegiao.fim - dadosRegiao.inicio + 1;

    const restante = quantidade - offset;
    limit = Math.min(30, restante);
    novoOffset = dadosRegiao.inicio - 1 + offset;
  }

  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?offset=${novoOffset}&limit=${limit}`,
  );

  const resultados = response.data.results;

  const pokemons = await Promise.all(
    resultados.map((pokemon: { name: string }) => buscarPokemon(pokemon.name)),
  );

  return pokemons;
}
