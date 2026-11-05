import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import "./PokeTermo.css";

const POKEDEXES = {
  kanto: { label: "Kanto", dex: "kanto" },
  johto: { label: "Johto", dex: "original-johto" },
  hoenn: { label: "Hoenn", dex: "hoenn" },
  sinnoh: { label: "Sinnoh", dex: "original-sinnoh" },
  unova: { label: "Unova", dex: "original-unova" },
  kalos: { label: "Kalos", dex: "kalos-central" },
  alola: { label: "Alola", dex: "original-alola" },
  galar: { label: "Galar", dex: "galar" },
  paldea: { label: "Paldea", dex: "paldea" },
} as const;
type PokemonRegion = keyof typeof POKEDEXES;
type PokedexResponse = { pokemon_entries: { pokemon_species: { name: string } }[] };

const ROWS = 6;
const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
type TileState = "correct" | "present" | "absent";
type GuessRow = { word: string; states: TileState[] };

function getRandomPokemon(pokemonList: string[], exclude?: string) {
  const choices = pokemonList.filter((pokemon) => pokemon !== exclude);
  return choices[Math.floor(Math.random() * choices.length)];
}

function scoreGuess(guess: string, answer: string): TileState[] {
  const states: TileState[] = Array(answer.length).fill("absent");
  const remaining = answer.split("");
  for (let i = 0; i < answer.length; i += 1) {
    if (guess[i] === answer[i]) {
      states[i] = "correct";
      remaining[i] = "";
    }
  }
  for (let i = 0; i < answer.length; i += 1) {
    if (states[i] === "correct") continue;
    const match = remaining.indexOf(guess[i]);
    if (match !== -1) {
      states[i] = "present";
      remaining[match] = "";
    }
  }
  return states;
}

export function PokeTermo() {
  const [region, setRegion] = useState<PokemonRegion>("kanto");
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [loadingRegion, setLoadingRegion] = useState(true);
  const [regionError, setRegionError] = useState("");
  const targetLength = answer.length;
  const [current, setCurrent] = useState("");
  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [message, setMessage] = useState("Descubra o Pokémon em 6 tentativas.");
  const [finished, setFinished] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRegion() {
      setLoadingRegion(true);
      setRegionError("");
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${POKEDEXES[region].dex}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Falha ao carregar a região.");
        const data = await response.json() as PokedexResponse;
        const names = [...new Set(data.pokemon_entries
          .map(({ pokemon_species }) => pokemon_species.name.toLowerCase().replace(/[^a-z]/g, ""))
          .filter((name) => /^[a-z]{6,12}$/.test(name)))];
        if (names.length === 0) throw new Error("Nenhum nome de Pokémon compatível nesta região.");
        setPokemonList(names);
        setAnswer(getRandomPokemon(names));
        setCurrent("");
        setGuesses([]);
        setFinished(false);
        setMessage("Descubra o Pokémon em 6 tentativas.");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPokemonList([]);
        setAnswer("");
        setRegionError("Não foi possível carregar os Pokémon desta região. Confira sua conexão e tente novamente.");
      } finally {
        if (!controller.signal.aborted) setLoadingRegion(false);
      }
    }
    void loadRegion();
    return () => controller.abort();
  }, [region]);

  const submitGuess = useCallback(() => {
    if (finished) return;
    if (loadingRegion || !answer) return;
    if (current.length !== targetLength) { setMessage(`A palavra precisa ter ${targetLength} letras.`); return; }
    if (!pokemonList.includes(current)) { setMessage(`Esse nome não está na Pokédex de ${POKEDEXES[region].label}.`); return; }
    const next = [...guesses, { word: current, states: scoreGuess(current, answer) }];
    setGuesses(next);
    setCurrent("");
    if (next.at(-1)?.states.every((state) => state === "correct")) {
      setMessage("Você acertou! Mandou bem, treinador.");
      setFinished(true);
    } else if (next.length === ROWS) {
      setMessage(`Fim de jogo! O Pokémon era ${answer.toUpperCase()}.`);
      setFinished(true);
    } else {
      setMessage("Boa! Tente outra palavra.");
    }
  }, [answer, current, finished, guesses, loadingRegion, pokemonList, region, targetLength]);

  useEffect(() => {
    inputRef.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (finished || showHelp || loadingRegion || !answer) return;
      if (event.key === "Enter") { event.preventDefault(); submitGuess(); }
      else if (event.key === "Backspace") { event.preventDefault(); setCurrent((value) => value.slice(0, -1)); }
      else if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        setCurrent((value) => value.length < targetLength ? value + event.key.toLowerCase() : value);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [answer, finished, loadingRegion, showHelp, submitGuess, targetLength]);

  function pressKey(key: string) {
    if (key === "ENTER") submitGuess();
    else if (key === "⌫") setCurrent((value) => value.slice(0, -1));
    else if (current.length < targetLength) setCurrent((value) => value + key.toLowerCase());
  }

  function playAgain() {
    setAnswer((previous) => getRandomPokemon(pokemonList, previous));
    setCurrent("");
    setGuesses([]);
    setFinished(false);
    setMessage("Descubra o Pokémon em 6 tentativas.");
    inputRef.current?.focus();
  }

  const keyStates = new Map<string, TileState>();
  guesses.forEach(({ word, states }) => word.split("").forEach((letter, index) => {
    const next = states[index];
    const previous = keyStates.get(letter);
    if (next === "correct" || (next === "present" && previous !== "correct") || !previous) keyStates.set(letter, next);
  }));

  return (
    <main className="poketermo-page">
      <div className="poketermo-heading">
        <span className="poketermo-eyebrow">DESAFIO DIÁRIO</span>
        <h1>PokéTermo</h1>
        <p>Adivinhe o Pokémon de hoje. Cada palpite precisa ter {targetLength} letras.</p>
        <button className="poketermo-help-button" type="button" onClick={() => setShowHelp(true)} aria-label="Como jogar">Como jogar?</button>
      </div>

      <label className="poketermo-region-select">
        <span>Escolha uma região</span>
        <select value={region} onChange={(event) => setRegion(event.target.value as PokemonRegion)} disabled={loadingRegion}>
          {Object.entries(POKEDEXES).map(([key, item]) => <option value={key} key={key}>{item.label}</option>)}
        </select>
      </label>

      {loadingRegion && <p className="poketermo-message" role="status">Carregando a Pokédex de {POKEDEXES[region].label}…</p>}
      {regionError && <p className="poketermo-message poketermo-error" role="alert">{regionError}</p>}

      {!loadingRegion && !regionError && <section className="poketermo-board" aria-label="Tabuleiro do jogo">
        {Array.from({ length: ROWS }, (_, row) => {
          const guess = guesses[row];
          const active = row === guesses.length && !finished;
          const letters = guess?.word ?? (active ? current : "");
          return <div className="poketermo-row" key={row} style={{ gridTemplateColumns: `repeat(${targetLength}, minmax(0, 1fr))` }}>
            {Array.from({ length: targetLength }, (_, col) => <div
              className={`poketermo-tile ${guess ? `tile-${guess.states[col]}` : ""} ${active && letters[col] ? "tile-filled" : ""}`}
              key={col}
              aria-label={letters[col] ?? "vazio"}
            >{letters[col]?.toUpperCase() ?? ""}</div>)}
          </div>;
        })}
      </section>}

      {!loadingRegion && !regionError && <p className="poketermo-message" aria-live="polite">{message}</p>}

      {finished && !loadingRegion && <div className="poketermo-reveal">
        <span>O Pokémon de hoje é <strong>{answer.toUpperCase()}</strong></span>
        <button type="button" onClick={playAgain}><RotateCcw size={16} /> Jogar outra rodada</button>
      </div>}

      {!finished && !loadingRegion && !regionError && <form className="poketermo-entry" onSubmit={(event) => { event.preventDefault(); submitGuess(); }}>
        <label className="sr-only" htmlFor="poketermo-guess">Digite seu palpite</label>
        <input ref={inputRef} id="poketermo-guess" value={current} onChange={(event) => setCurrent(event.target.value.replace(/[^a-zA-Z]/g, "").slice(0, targetLength).toLowerCase())} maxLength={targetLength} autoComplete="off" />
        <button type="submit">Enviar</button>
      </form>}

      {!loadingRegion && !regionError && <div className="poketermo-keyboard" aria-label="Teclado virtual">
        {KEY_ROWS.map((row) => <div className="keyboard-row" key={row}>{row.split("").map((key) => <button type="button" className={`keyboard-key ${keyStates.has(key.toLowerCase()) ? `tile-${keyStates.get(key.toLowerCase())}` : ""}`} key={key} onClick={() => pressKey(key)}>{key}</button>)}</div>)}
        <div className="keyboard-row"><button type="button" className="keyboard-key keyboard-wide" onClick={() => pressKey("ENTER")}>ENTER</button><button type="button" className="keyboard-key keyboard-wide" onClick={() => pressKey("⌫")}>⌫</button></div>
      </div>}

      {showHelp && <div className="poketermo-modal-backdrop" onClick={() => setShowHelp(false)} role="presentation">
        <section className="poketermo-modal" role="dialog" aria-modal="true" aria-labelledby="poketermo-modal-title" onClick={(event) => event.stopPropagation()}>
          <button className="poketermo-modal-close" type="button" onClick={() => setShowHelp(false)} aria-label="Fechar">×</button>
          <span className="poketermo-eyebrow">GUIA DO TREINADOR</span>
          <h2 id="poketermo-modal-title">Como jogar</h2>
          <p>Descubra o nome do Pokémon em até 6 tentativas. Digite uma palavra com {targetLength} letras e envie seu palpite.</p>
          <div className="help-example"><span className="tile-correct">P</span><span><strong>Verde</strong> — letra certa no lugar certo.</span></div>
          <div className="help-example"><span className="tile-present">I</span><span><strong>Amarelo</strong> — a letra existe, mas está em outro lugar.</span></div>
          <div className="help-example"><span className="tile-absent">K</span><span><strong>Cinza</strong> — essa letra não aparece no nome.</span></div>
          <button className="poketermo-start" type="button" onClick={() => setShowHelp(false)}>Entendi, vamos jogar!</button>
        </section>
      </div>}
    </main>
  );
}
