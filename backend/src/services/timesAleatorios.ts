import type { PokemonPontuado } from "./pontuacaoTime.js";
import { pontuarCandidato } from "./pontuacaoTime.js";
import { pokemonLendariosEMiticos } from "../data/pokemonProibidos.js";

export function montarTime(
  candidatos: PokemonPontuado[],
  formasFinais: readonly number[],
  tamanho = 6,
) {
  const candidatosValidos = candidatos.filter(
    (pokemon) => !pokemonLendariosEMiticos.has(pokemon.id),
  );

  if (candidatosValidos.length === 0) {
    throw new Error("Nenhum Pokémon válido para montar o time.");
  }

  const iniciaisDisponiveis = candidatosValidos.filter((pokemon) =>
    formasFinais.includes(pokemon.id),
  );

  if (iniciaisDisponiveis.length === 0) {
    throw new Error("Nenhuma forma final de inicial disponível.");
  }

  iniciaisDisponiveis.sort((a, b) => b.pontuacao - a.pontuacao);

  const primeiroPokemon = iniciaisDisponiveis[0];

  if (!primeiroPokemon) {
    throw new Error("Não foi possível selecionar o inicial.");
  }

  const time: PokemonPontuado[] = [primeiroPokemon];

  const candidatosRestantes = candidatosValidos.filter(
    (pokemon) => !formasFinais.includes(pokemon.id),
  );

  while (time.length < tamanho && candidatosRestantes.length > 0) {
    let melhorPokemon = candidatosRestantes[0];

    if (!melhorPokemon) {
      break;
    }

    let melhorPontuacao = pontuarCandidato(melhorPokemon, time);

    for (const candidato of candidatosRestantes) {
      const pontuacao = pontuarCandidato(candidato, time);

      if (pontuacao > melhorPontuacao) {
        melhorPokemon = candidato;

        melhorPontuacao = pontuacao;
      }
    }

    time.push(melhorPokemon);

    const indice = candidatosRestantes.findIndex(
      (pokemon) => pokemon.id === melhorPokemon.id,
    );

    if (indice !== -1) {
      candidatosRestantes.splice(indice, 1);
    }
  }

  return time;
}
