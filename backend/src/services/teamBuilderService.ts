import { jogos } from "../data/jogos.js";

import {
  regrasJogo,
} from "../data/regrasJogo.js";

import {
  pokemonLendariosEMiticos,
} from "../data/pokemonProibidos.js";

import {
  verificarDisponibilidade,
} from "./pokemonDisponibilidade.js";

import {
  buscarDadosPokemon,
} from "./pokemonService.js";

import {
  pontuarPokemon,
} from "./pontuacaoTime.js";

import {
  montarTime,
} from "./timesAleatorios.js";

import {
  buscarPokemonDoJogo,
} from "./pokedexJogo.js";

import type {
  PokemonPontuado,
} from "./pontuacaoTime.js";

type TeamBuilderInput = {
  jogo: string;
  objetivo: string;
};

const TAMANHO_LOTE = 10;

export async function montarTimeService({
  jogo,
  objetivo,
}: TeamBuilderInput) {
  const jogoSelecionado =
    jogos[
      jogo as keyof typeof jogos
    ];

  const regraJogo =
    regrasJogo[
      jogo as keyof typeof regrasJogo
    ];

  if (!jogoSelecionado) {
    throw new Error(
      "Jogo não suportado",
    );
  }

  if (!regraJogo) {
    throw new Error(
      "Regras do jogo não encontradas",
    );
  }

  const pokemonIds =
    await buscarPokemonDoJogo(
      jogoSelecionado.versionGroup,
    );

  console.log(
    `Pokémon encontrados para ${jogo}:`,
    pokemonIds.length,
  );

  const candidatos: PokemonPontuado[] =
    [];

  for (
    let inicio = 0;
    inicio < pokemonIds.length;
    inicio += TAMANHO_LOTE
  ) {
    const lote =
      pokemonIds.slice(
        inicio,
        inicio +
          TAMANHO_LOTE,
      );

    console.log(
      `Processando ${inicio + 1}-${Math.min(
        inicio +
          TAMANHO_LOTE,
        pokemonIds.length,
      )} de ${pokemonIds.length}`,
    );

    const candidatosLote =
      await Promise.all(
        lote.map(
          async (pokemonId) => {
            try {
              if (
                pokemonLendariosEMiticos.has(
                  pokemonId,
                )
              ) {
                return null;
              }

              const disponibilidade =
                await verificarDisponibilidade(
                  pokemonId,
                  jogoSelecionado.apiName,
                );

              const ehInicial =
                (
                  regraJogo.iniciais as readonly number[]
                ).includes(
                  pokemonId,
                );

              if (
                !disponibilidade.disponivel &&
                !ehInicial
              ) {
                return null;
              }

              const dados =
                await buscarDadosPokemon(
                  pokemonId,
                  jogoSelecionado.versionGroup,
                  false,
                );

              const pokemonPontuado =
                pontuarPokemon(
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
              console.error(
                `Erro ao processar Pokémon ${pokemonId}:`,
                error,
              );

              return null;
            }
          },
        ),
      );

    for (
      const pokemon of candidatosLote
    ) {
      if (
        pokemon !== null
      ) {
        candidatos.push(
          pokemon,
        );
      }
    }
  }

  if (
    candidatos.length === 0
  ) {
    throw new Error(
      "Nenhum Pokémon disponível para esse jogo.",
    );
  }

  const formasFinais =
    regraJogo.formasFinais as readonly number[];

  const iniciaisFinais:
    PokemonPontuado[] = [];

  for (
    const formaFinalId of formasFinais
  ) {
    try {
      if (
        pokemonLendariosEMiticos.has(
          formaFinalId,
        )
      ) {
        continue;
      }

      const dados =
        await buscarDadosPokemon(
          formaFinalId,
          jogoSelecionado.versionGroup,
          false,
        );

      const pokemonPontuado =
        pontuarPokemon(
          dados,
          objetivo,
          jogoSelecionado.regiao,
        );

      iniciaisFinais.push(
        pokemonPontuado,
      );
    } catch (error) {
      console.error(
        `Erro ao buscar inicial final ${formaFinalId}:`,
        error,
      );
    }
  }

  if (
    iniciaisFinais.length ===
    0
  ) {
    throw new Error(
      "Nenhum inicial final disponível para esse jogo.",
    );
  }

  for (
    const inicial of iniciaisFinais
  ) {
    const jaExiste =
      candidatos.some(
        (pokemon) =>
          pokemon.id ===
          inicial.id,
      );

    if (!jaExiste) {
      candidatos.push(
        inicial,
      );
    }
  }

  console.log(
    `Candidatos disponíveis: ${candidatos.length}`,
  );

  console.log(
    `Iniciais finais disponíveis: ${iniciaisFinais.length}`,
  );

  const time =
    montarTime(
      candidatos,
      formasFinais,
    );

  const timeComGolpes = await Promise.all(
    time.map(async (pokemon) => {
      try {
        const detalhes = await buscarDadosPokemon(
          pokemon.id,
          jogoSelecionado.versionGroup,
        );
        return { ...pokemon, golpes: detalhes.golpes };
      } catch (error) {
        console.error(`Erro ao buscar golpes do Pokémon ${pokemon.id}:`, error);
        return pokemon;
      }
    }),
  );

  return {
    jogo:
      jogoSelecionado.nome,

    objetivo,

    quantidadeDisponivel:
      candidatos.length,

    time: timeComGolpes,
  };
}
