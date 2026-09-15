export type PokemonTime = {
  id: number;

  nome: string;

  gif: string | null;

  tipos: string[];

  habilidades: {
    nome: string;
    oculta: boolean;
  }[];

  stats: Record<string, number>;

  pontuacao: number;

  disponibilidade: {
    disponivel: boolean;

    metodo: string;

    primeiraDisponibilidade: {
      local: string;
      nivelMinimo: number;
      nivelMaximo: number;
      fase: string;
      progresso: number;
    } | null;

    jornada: {
      utilizavel: boolean;
      penalidade: number;
      motivo: string;
    };

    tempoEstimado: {
      valor: number;
      unidade: string;
    };

    locais: {
      local: string;
      nivelMinimo: number;
      nivelMaximo: number;
      metodo: string;
      chance: number;
    }[];
  };
};

export type ResultadoTime = {
  jogo: string;

  objetivo: string;

  quantidadeDisponivel: number;

  time: PokemonTime[];
};
