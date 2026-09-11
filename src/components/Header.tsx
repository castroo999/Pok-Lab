import "./Header.css";
import pokebola from "../assets/pokebola.png";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="topo">
        <div className="logo">
          <img src={pokebola} alt="pokebola" />
          <h1>PokéLab</h1>
        </div>

        <nav className="navegacao">
          <NavLink to="/pokedex">Pokédex</NavLink>
          <NavLink to="/ver-times">Seus Times</NavLink>
          <NavLink to="/analise">Análise</NavLink>
        </nav>
      </div>
    </header>
  );
}
