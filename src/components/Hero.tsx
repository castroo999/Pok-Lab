import "./Hero.css";
import { useEffect, useState } from "react";
import { pokemonsHero } from "../data/DadosPokemon.js";

export default function Hero() {
const [sprite, setSprite] = useState<string | null>(null);

  useEffect(() => {
    const indice = Math.floor(Math.random() * pokemonsHero.length);
    const id = pokemonsHero[indice];

    async function buscarSprite() {
      try {
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
        setSprite(sprite);
      } catch (error) {
        console.error("Erro ao buscar o sprite:", error);
      }
    }

    buscarSprite();
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Bem-vindo ao PokéLab!</h1>
        <p>
          Explore o mundo dos Pokémon e descubra suas habilidades e crie suas
          estratégias!
        </p>
      </div>

      {sprite && <img src={sprite} alt="Pokémon" />}

      <div className="hero-btn">
        <a href="/pokedex" className="btn">
          Acessar Pokédex
        </a>
        <a href="/ver-times" className="btn">
          Ver Seus Times
        </a>
      </div>
    </section>
  );
}
