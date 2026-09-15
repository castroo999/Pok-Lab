import "./TeamBuilder.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Jogos from "../components/OptionJogos";
import type { ResultadoTime } from "../types/teamBuilderTypes";

export default function Times() {
  const navigate = useNavigate();

  const [jogo, setJogo] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const [resultado, setResultado] = useState<ResultadoTime | null>(null);

  const [carregando, setCarregando] = useState(false);

  const [erro, setErro] = useState("");

  async function montarTime() {
    if (!jogo || !objetivo) {
      setErro("Escolha o jogo e o objetivo antes de montar o time.");

      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setResultado(null);

      const response = await fetch("http://localhost:3000/api/team-builder", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          jogo,
          objetivo,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao montar o time.");
      }

      const data: ResultadoTime = await response.json();

      setResultado(data);
    } catch (error) {
      console.error("Erro ao montar o time:", error);

      setErro("Não foi possível montar o time.");
    } finally {
      setCarregando(false);
    }
  }

  function voltar() {
    navigate("/home");
  }

  return (
    <section className="builder-topo">
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>

      <h1>Monte seu time</h1>

      <p>Escolha o jogo e monte o melhor time para sua jornada</p>

      <Jogos
        jogo={jogo}
        setJogo={setJogo}
        objetivo={objetivo}
        setObjetivo={setObjetivo}
      />

      <button
        className="montar"
        type="button"
        onClick={montarTime}
        disabled={carregando}
      >
        {carregando ? "Montando..." : "Fazer meu time"}
      </button>

      {erro && <p className="erro-time">{erro}</p>}

      {resultado && (
        <section className="resultado-time">
          <div className="resultado-header">
            <h2>Seu time para {resultado.jogo}</h2>

            <span>{resultado.time.length}/6 Pokémon</span>
          </div>

          <div className="time">
            {resultado.time.map((pokemon, index) => (
              <article className="pokemon-slot" key={pokemon.id}>
                <span>#{index + 1}</span>

                {pokemon.gif ? (
                  <img src={pokemon.gif} alt={pokemon.nome} />
                ) : (
                  <div className="sem-gif">?</div>
                )}

                <h2>{pokemon.nome}</h2>

                <div className="tipos">
                  {pokemon.tipos.map((tipo) => (
                    <span key={tipo} className={`tipo ${tipo}`}>
                      {tipo}
                    </span>
                  ))}
                </div>

                <strong>Pontuação: {pokemon.pontuacao}</strong>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
