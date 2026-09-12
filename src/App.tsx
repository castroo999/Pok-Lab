import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { Pokedex } from "./pages/Pokedex";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/times" element={<h1>Seus Times</h1>} />
        <Route path="/analise" element={<h1>Análise</h1>} />
      </Routes>
    </>
  );
}