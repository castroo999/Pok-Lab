import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "./TimesSalvos.css";

type Golpe = {
  nome: string;
  tipo: string;
  poder: number;
  precisao: number;
  categoria: string;
};

type PokemonTime = {
  id: number;
  nome: string;
  gif: string | null;
  tipos: string[];
  habilidades: {
    nome: string;
    oculta: boolean;
  }[];
  stats: Record<string, number>;
  golpes: Golpe[];
  pontuacao: number;
};

type TimeSalvo = {
  id: string;
  nome: string;
  jogo: string;
  objetivo: string;
  time: PokemonTime[];
};

export default function TimesSalvos() {
  const navigate = useNavigate();

  const [times, setTimes] = useState<TimeSalvo[]>([]);

  useEffect(() => {
    const timesSalvos = localStorage.getItem("timesSalvos");

    if (!timesSalvos) {
      return;
    }

    try {
      const dados: TimeSalvo[] = JSON.parse(timesSalvos);

      setTimes(dados);
    } catch (error) {
      console.error("Erro ao carregar times salvos:", error);
    }
  }, []);

  function excluirTime(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este time?",
    );

    if (!confirmar) {
      return;
    }

    const novosTimes = times.filter((time) => time.id !== id);

    localStorage.setItem("timesSalvos", JSON.stringify(novosTimes));

    setTimes(novosTimes);
  }

  function irParaMontarTime() {
    navigate("/team-builder");
  }

  function voltar() {
    navigate("/home");
  }

  return (
    <main className="pagina-times-salvos">
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>
      <section className="topo-times-salvos">
        <h1>Times Salvos</h1>

        <p>Aqui estão todos os seus times Pokémon.</p>

        <button className="novo-time" type="button" onClick={irParaMontarTime}>
          Montar novo time
        </button>
      </section>

      <section className="lista-times">
        {times.length === 0 ? (
          <div className="nenhum-time">
            <h2>Nenhum time salvo</h2>

            <p>Monte um time e salve para encontrar ele aqui.</p>

            <button
              className="novo-time"
              type="button"
              onClick={irParaMontarTime}
            >
              Montar meu primeiro time
            </button>
          </div>
        ) : (
          times.map((time) => (
            <article className="card-time-salvo" key={time.id}>
              <div className="card-time-header">
                <div>
                  <h2>{time.nome}</h2>

                  <p>{time.jogo}</p>

                  <span>{time.objetivo}</span>
                </div>

                <button
                  className="excluir-time"
                  type="button"
                  onClick={() => excluirTime(time.id)}
                >
                  Excluir
                </button>
              </div>

              <div className="pokemon-time-salvo">
                {time.time.map((pokemon) => (
                  <div className="pokemon-salvo" key={pokemon.id}>
                    {pokemon.gif ? (
                      <img src={pokemon.gif} alt={pokemon.nome} />
                    ) : (
                      <div className="sem-gif">?</div>
                    )}

                    <h3>{pokemon.nome}</h3>

                    <div className="tipos">
                      {pokemon.tipos.map((tipo) => (
                        <span className={`tipo ${tipo}`} key={tipo}>
                          {tipo}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
