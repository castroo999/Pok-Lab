import { progressoJogos } from "../data/progressoJogos.js";

export function analisarProgresso(jogo: string, local: string) {
  const perfil = progressoJogos[jogo];

  if (!perfil) {
    return {
      progresso: 50,
      fase: "Desconhecido",
      penalidade: 20,
      utilizavel: true,
      motivo: "Progressão não catalogada",
    };
  }

  const nome = local.toLowerCase();

  const ehPosJogo = perfil.locaisPosJogo.some((localPosJogo) =>
    nome.includes(localPosJogo),
  );

  if (ehPosJogo) {
    return {
      progresso: 100,
      fase: "Pós-jogo",
      penalidade: perfil.penalidadePosJogo,
      utilizavel: false,
      motivo: "Disponível apenas muito tarde ou no pós-jogo",
    };
  }

  const ehFinal = perfil.locaisFinais.some((localFinal) =>
    nome.includes(localFinal),
  );

  if (ehFinal) {
    return {
      progresso: 85,
      fase: "Final da campanha",
      penalidade: perfil.penalidadeFinal,
      utilizavel: true,
      motivo: "Disponível apenas no final da campanha",
    };
  }

  const ehMuitoCedo = perfil.locaisMuitoCedo.some((localCedo) =>
    nome.includes(localCedo),
  );

  if (ehMuitoCedo) {
    return {
      progresso: 10,
      fase: "Início da campanha",
      penalidade: 0,
      utilizavel: true,
      motivo: "Disponível cedo na jornada",
    };
  }

  return {
    progresso: 50,
    fase: "Durante a campanha",
    penalidade: 5,
    utilizavel: true,
    motivo: "Disponível durante a jornada",
  };
}
