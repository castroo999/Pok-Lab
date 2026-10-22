import "./Pokedex.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft } from "lucide-react";
import type { Pokemon } from "../types/pokemonTypes";
import { apiUrl } from "../lib/api";

export function Pokedex() {
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [busca, setBusca] = useState("");
  const [regiao, setRegiao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function pegarPokedex() {
      setCarregando(true);
      setErro("");
      try {
        const query = new URLSearchParams({ offset: String(offset) });
        if (regiao) query.set("regiao", regiao);
        const response = await fetch(apiUrl(`pokedex?${query}`), { signal: controller.signal });
        if (!response.ok) throw new Error("Falha ao carregar Pokédex.");
        const data = await response.json();
        if (!Array.isArray(data.pokemons)) throw new Error("Resposta inválida da Pokédex.");
        setPokedex(data.pokemons);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPokedex([]);
        setErro("Não foi possível carregar a Pokédex. Confira se a API está ligada e tente novamente.");
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    void pegarPokedex();
    return () => controller.abort();
  }, [offset, regiao, reloadKey]);

  async function buscarPokemon() {
    if (!busca.trim()) return;
    setCarregando(true);
    setErro("");
    try {
      const response = await fetch(apiUrl(`pegar-pokemon/${encodeURIComponent(busca.trim().toLowerCase())}`));
      const data = await response.json();
      if (!response.ok || !data.pokemon) throw new Error("Pokémon não encontrado.");
      setPokedex([data.pokemon]);
    } catch (error) {
      setPokedex([]);
      setErro(error instanceof Error ? error.message : "Não foi possível buscar o Pokémon.");
    } finally {
      setCarregando(false);
    }
  }

  function limparBusca() {
    setBusca("");
    setRegiao("");
    setOffset(0);
    setErro("");
    setReloadKey((key) => key + 1);
  }

  return (
    <section className="pokedex-topo">
      <button className="voltar" type="button" onClick={() => navigate("/home")}>
        <ChevronLeft size={18} /> Voltar
      </button>

      <h1>Pokédex</h1>
      <div className="buscar">
        <div className="input-busca">
          <Search />
          <input
            type="text"
            placeholder="Buscar Pokémon"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") void buscarPokemon(); }}
          />
        </div>
        <button type="button" onClick={limparBusca}>Limpar busca</button>
        <button type="button" onClick={() => void buscarPokemon()} disabled={carregando}>Buscar</button>
      </div>

      <div className="regioes">
        <select value={regiao} onChange={(event) => { setRegiao(event.target.value); setOffset(0); }}>
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

      {erro && <p role="alert" className="status-pokedex erro-pokedex">{erro}</p>}
      {carregando && <p className="status-pokedex">Carregando Pokémon...</p>}
      {!carregando && !erro && pokedex.length === 0 && <p className="status-pokedex">Nenhum Pokémon encontrado nesta página.</p>}
      <div className="pokedex-container">
        {pokedex.map((pokemon) => (
          <div key={pokemon.id} className="pokedex-pokemon">
            <span className="pokedex-number">#{String(pokemon.id).padStart(3, "0")}</span>
            <h2>{pokemon.name}</h2>
            {pokemon.gif && <img src={pokemon.gif} alt={pokemon.name} />}
            <div className="pokedex-types">
              {pokemon.types.map((type) => <span key={type} className={`pokedex-type ${type}`}>{type}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="btn-container">
        <button type="button" onClick={() => setOffset(Math.max(0, offset - 30))} disabled={offset === 0 || carregando}>Página anterior</button>
        <button type="button" onClick={() => setOffset(offset + 30)} disabled={carregando}>Próxima página</button>
      </div>
    </section>
  );
}
