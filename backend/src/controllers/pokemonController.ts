import axios from "axios";
import { type Request, type Response } from "express";

// Controller para pegar os sprites dos pokemons
export async function pegarSprites(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
        res.status(200).json({ sprite, id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}

// Controller para pegar o pokemon desejado
export async function pegarPokemon(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${id}/`,
    );
    const pokemon = response.data;
    res.status(200).json({ pokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}
