import "./Pokedex.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft } from "lucide-react";
import type { Pokemon } from "../types/pokemonTypes";

export function Pokedex() {
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [busca, setBusca] = useState("");
  const [regiao, setRegiao] = useState("");
  const navigate = useNavigate();

    function voltar() {
    navigate("/home");
  }

  const limparBusca = async () => {
    setBusca("");
    setRegiao("")
    setOffset(0);
  };

  async function buscarPokemon() {
    try {
      const pokemonBuscado = await fetch(
        `http://localhost:3000/api/pegar-pokemon/${busca.toLowerCase()}`,
      );
      const data = await pokemonBuscado.json();

      setPokedex([data.pokemon]);
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
    }
  }

  useEffect(() => {
    async function pegarPokedex() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/pokedex?offset=${offset}&regiao=${regiao}`,
        );

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Erro ao buscar Pokédex:", error);
      }
    }
    async function fetchPokedex() {
      const data = await pegarPokedex();
      setPokedex(data.pokemons);
    }
    fetchPokedex();
  }, [offset, regiao]);

  return (
    <section className="pokedex-topo">
      <button
        className="voltar"
        type="button"
        onClick={voltar}
      >
        <ChevronLeft size={18} />
        Voltar
      </button>

      <h1>Pokédex</h1>
      <div className="buscar">
        <div className="input-busca">
          <Search />

          <input
            type="text"
            placeholder="Buscar Pokémon"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                buscarPokemon();
              }
            }}
          />
        </div>

        <button onClick={limparBusca}>Limpar busca</button>
      </div>

      <div className="regioes">
        <select value={regiao} onChange={(e) => {
            setRegiao(e.target.value)
            setOffset(0)
          }}>

          <option value="">Todas as regiões</option>
          <option value="kanto">Kanto</option>
          <option value="johto">Johto</option>
          <option value="hoenn">Hoenn</option>
          <option value="sinnoh">Sinnoh</option>
          <option value="unova">Unova</option>
          <option value="kalos">Kalos</option>
          <option value="alola">Alola</option>
          <option value="galar">Galar</option>
          <option value="paldea">Paldea</option>

        </select>
      </div>

      <div className="pokedex-container">
        {pokedex.map((pokemon: Pokemon) => (
          <div key={pokemon.id} className="pokedex-pokemon">
            <span className="pokedex-number">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.gif} alt={pokemon.name} />
            <div className="pokedex-types">
              {pokemon.types.map((type: string) => (
                <span key={type} className={`pokedex-type ${type}`}>
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="btn-container">
        <button onClick={() => setOffset(Math.max(0, offset - 30))}>
          Página anterior
        </button>
        <button onClick={() => setOffset(offset + 30)}>Próxima página</button>
      </div>
    </section>
  );
}
