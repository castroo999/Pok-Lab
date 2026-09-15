import axios from "axios";
import { jogos } from "../data/jogos.js";
import { verificarDisponibilidade } from "./pokemonDisponibilidade.js";
import { buscarDadosPokemon } from "./pokemonService.js";
import { pontuarPokemon } from "./pontuacaoTime.js";
import { montarTime } from "./timesAleatorios.js";
import type { PokemonPontuado } from "./pontuacaoTime.js";

type TeamBuilderInput = {
  jogo: string;
  objetivo: string;
};

type PokemonListaResponse = {
  results: {
    name: string;
    url: string;
  }[];
};

const LIMITE_POKEMON = 151;

const TAMANHO_LOTE = 10;

export async function montarTimeService({ jogo, objetivo }: TeamBuilderInput) {
  const jogoSelecionado = jogos[jogo as keyof typeof jogos];

  if (!jogoSelecionado) {
    throw new Error("Jogo não suportado");
  }

  const response = await axios.get<PokemonListaResponse>(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMITE_POKEMON}&offset=0`,
  );

  const resultados = response.data.results;

  const candidatos: PokemonPontuado[] = [];

  for (let inicio = 0; inicio < resultados.length; inicio += TAMANHO_LOTE) {
    const lote = resultados.slice(inicio, inicio + TAMANHO_LOTE);

    const candidatosLote = await Promise.all(
      lote.map(async (pokemon) => {
        const pokemonId = Number(pokemon.url.split("/").filter(Boolean).pop());

        try {
          const disponibilidade = await verificarDisponibilidade(
            pokemonId,
            jogoSelecionado.apiName,
          );

          if (!disponibilidade.disponivel) {
            return null;
          }

          const dados = await buscarDadosPokemon(pokemonId);

          const pokemonPontuado = pontuarPokemon(
            dados,
            objetivo,
            jogoSelecionado.regiao,
            disponibilidade,
          );

          return {
            ...pokemonPontuado,
            disponibilidade,
          };
        } catch (error) {
          console.error(`Erro ao buscar ${pokemon.name}:`, error);

          return null;
        }
      }),
    );

    for (const pokemon of candidatosLote) {
      if (pokemon !== null) {
        candidatos.push(pokemon);
      }
    }
  }

  const time = montarTime(candidatos);

  return {
    jogo: jogoSelecionado.nome,

    objetivo,

    quantidadeDisponivel: candidatos.length,

    time,
  };
}
