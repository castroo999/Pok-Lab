import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TeamBuilder from './pages/TeamBuilder'
import { Pokedex } from "./pages/Pokedex";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Hero />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/team-builder" element={<TeamBuilder />} />
        <Route path="/analise" element={<h1>analise</h1>} />
      </Routes>
    </>
  );
}
