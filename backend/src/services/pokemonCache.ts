import type { PokemonEncounter } from "../types/pokemonEncounterTypes.js";

const encountersCache = new Map<number, PokemonEncounter[]>();

export function pegarDoCache(pokemonId: number) {
  return encountersCache.get(pokemonId);
}

export function salvarNoCache(
  pokemonId: number,
  encounters: PokemonEncounter[],
) {
  encountersCache.set(pokemonId, encounters);
}