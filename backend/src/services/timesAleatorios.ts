import type { PokemonPontuado } from "./pontuacaoTime.js";

export function montarTime(
  candidatos: PokemonPontuado[],
  tamanho = 6,
) {
  if (candidatos.length === 0) {
    throw new Error(
      "Nenhum Pokémon disponível para montar o time",
    );
  }

  const time: PokemonPontuado[] = [];

  const candidatosRestantes = [
    ...candidatos,
  ];

  candidatosRestantes.sort(
    (a, b) =>
      b.pontuacao -
      a.pontuacao,
  );

  const primeiroPokemon =
    candidatosRestantes.shift();

  if (!primeiroPokemon) {
    throw new Error(
      "Não foi possível selecionar o primeiro Pokémon",
    );
  }

  time.push(
    primeiroPokemon,
  );

  while (
    time.length < tamanho &&
    candidatosRestantes.length > 0
  ) {
    let melhorPokemon =
      candidatosRestantes[0];

    if (!melhorPokemon) {
      break;
    }

    let melhorPontuacao =
      pontuarCandidato(
        melhorPokemon,
        time,
      );

    for (
      const candidato of candidatosRestantes
    ) {
      const pontuacao =
        pontuarCandidato(
          candidato,
          time,
        );

      if (
        pontuacao >
        melhorPontuacao
      ) {
        melhorPokemon =
          candidato;

        melhorPontuacao =
          pontuacao;
      }
    }

    time.push(
      melhorPokemon,
    );

    const indice =
      candidatosRestantes.findIndex(
        (pokemon) =>
          pokemon.id ===
          melhorPokemon.id,
      );

    if (indice !== -1) {
      candidatosRestantes.splice(
        indice,
        1,
      );
    }
  }

  return time;
}

function pontuarCandidato(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const cobertura =
    calcularCobertura(
      pokemon,
      time,
    );

  const diversidade =
    calcularDiversidade(
      pokemon,
      time,
    );

  const equilibrio =
    calcularEquilibrio(
      pokemon,
      time,
    );

  return (
    pokemon.pontuacao +
    cobertura * 4 +
    diversidade * 8 +
    equilibrio
  );
}

function calcularCobertura(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const tiposDoTime =
    new Set<string>();

  for (const membro of time) {
    for (const tipo of membro.tipos) {
      tiposDoTime.add(tipo);
    }
  }

  let cobertura = 0;

  const vantagens: Record<
    string,
    string[]
  > = {
    normal: [],
    fire: [
      "grass",
      "ice",
      "bug",
      "steel",
    ],
    water: [
      "fire",
      "ground",
      "rock",
    ],
    electric: [
      "water",
      "flying",
    ],
    grass: [
      "water",
      "ground",
      "rock",
    ],
    ice: [
      "grass",
      "ground",
      "flying",
      "dragon",
    ],
    fighting: [
      "normal",
      "ice",
      "rock",
      "dark",
      "steel",
    ],
    poison: [
      "grass",
      "fairy",
    ],
    ground: [
      "fire",
      "electric",
      "poison",
      "rock",
      "steel",
    ],
    flying: [
      "grass",
      "fighting",
      "bug",
    ],
    psychic: [
      "fighting",
      "poison",
    ],
    bug: [
      "grass",
      "psychic",
      "dark",
    ],
    rock: [
      "fire",
      "ice",
      "flying",
      "bug",
    ],
    ghost: [
      "psychic",
      "ghost",
    ],
    dragon: [
      "dragon",
    ],
    dark: [
      "psychic",
      "ghost",
    ],
    steel: [
      "ice",
      "rock",
      "fairy",
    ],
    fairy: [
      "fighting",
      "dragon",
      "dark",
    ],
  };

  for (const tipo of pokemon.tipos) {
    const tiposAlvo =
      vantagens[tipo] ?? [];

    for (const tipoAlvo of tiposAlvo) {
      if (
        !tiposDoTime.has(tipoAlvo)
      ) {
        cobertura++;
      }
    }
  }

  return cobertura;
}

function calcularDiversidade(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const tiposDoTime =
    new Set(
      time.flatMap(
        (membro) => membro.tipos,
      ),
    );

  return pokemon.tipos.filter(
    (tipo) =>
      !tiposDoTime.has(tipo),
  ).length;
}

function calcularEquilibrio(
  pokemon: PokemonPontuado,
  time: PokemonPontuado[],
) {
  const ataque =
    pokemon.stats.attack ?? 0;

  const ataqueEspecial =
    pokemon.stats[
      "special-attack"
    ] ?? 0;

  const fisico =
    ataque >= ataqueEspecial;

  const fisicos =
    time.filter(
      (membro) =>
        (membro.stats.attack ?? 0) >=
        (membro.stats[
          "special-attack"
        ] ?? 0),
    ).length;

  const especiais =
    time.length - fisicos;

  if (
    fisico &&
    fisicos < 3
  ) {
    return 10;
  }

  if (
    !fisico &&
    especiais < 3
  ) {
    return 10;
  }

  return 0;
}