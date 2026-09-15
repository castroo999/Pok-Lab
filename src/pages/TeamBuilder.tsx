import "./TeamBuilder.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Jogos from "../components/OptionJogos";
import type { Pokemon } from "../types/pokemonTypes";

export default function Times() {
  const navigate = useNavigate();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  function voltar() {
    navigate("/home");
  }

  useEffect(() => {
    async function pegarPokemonsAleatorios() {
      try {
        const ids = Array.from({ length: 6 }, () =>
          Math.floor(Math.random() * 1025),
        );

        const respostas = await Promise.all(
          ids.map((id) =>
            fetch(`http://localhost:3000/api/pegar-pokemon/${id}`),
          ),
        );

        const dados = await Promise.all(
          respostas.map((resposta) => resposta.json()),
        );

        const time = dados.map((data) => data.pokemon);

        setPokemons(time);
      } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
      }
    }

    pegarPokemonsAleatorios();
  }, []);

  return (
    <section className="builder-topo">
      <button className="voltar" type="button" onClick={voltar}>
        <ChevronLeft size={18} />
        Voltar
      </button>

      <h1>Monte seu time</h1>
      <p>Escolha os jogos e monte o melhor time para cada um</p>
      <Jogos />

      <div className="time">
        {pokemons.map((pokemon) => (
          <div className="pokemon-slot" key={pokemon.id}>
            <span>#{String(pokemon.id).padStart(3, "0")}</span>

            <img src={pokemon.gif} alt={pokemon.name} />

            <h2>{pokemon.name}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
