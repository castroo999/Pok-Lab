import { type Request, type Response } from "express";
import { buscarPokedex, buscarPokemon } from "../services/pokemonService.js";


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
export async function pegarPokemon(req: Request<{ id: string }>,res: Response,) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        erro: "Nome ou número do Pokémon não informado",
      });
    }
    const pokemon = await buscarPokemon(id);

    res.status(200).json({ pokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Pokémon não encontrado",
    });
  }
}

// Controller para pegar a pokedex
export async function pegarPokedex(req: Request, res: Response) {
  try {
    const { offset = 0, regiao } = req.query;

    const pokemons = await buscarPokedex(
      Number(offset),
      regiao as string
    );

    res.status(200).json({ pokemons });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro interno do servidor",
    });
  }
}
