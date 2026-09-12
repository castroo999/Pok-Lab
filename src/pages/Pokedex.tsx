import "./Pokedex.css";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { Pokemon } from "../types/pokemonTypes";

export function Pokedex() {
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [busca, setBusca] = useState("");

  const limparBusca = async () => {
    setBusca("");
    setOffset(0);

    const response = await fetch("http://localhost:3000/api/pokedex?offset=0");

    const data = await response.json();

    setPokedex(data.pokemons);
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
          `http://localhost:3000/api/pokedex?offset=${offset}`,
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
  }, [offset]);

  return (
    <section className="pokedex-topo">
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
