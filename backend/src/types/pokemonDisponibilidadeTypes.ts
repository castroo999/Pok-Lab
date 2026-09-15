export type MetodoObtencao =
  | "selvagem"
  | "sos"
  | "fishing"
  | "surf"
  | "presente"
  | "troca"
  | "fossil"
  | "lendario"
  | "ultra-wormhole"
  | "outro";

export type PokemonAvailability = {
  disponivel: boolean;

  metodo: MetodoObtencao;

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
    unidade: "progresso";
  };

  locais: {
    local: string;
    nivelMinimo: number;
    nivelMaximo: number;
    metodo: string;
    chance: number;
  }[];
};