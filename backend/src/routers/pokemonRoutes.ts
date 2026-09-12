import {  Router } from "express";
import { pegarSprites } from '../controllers/pokemonController.js'
import { pegarPokemon } from '../controllers/pokemonController.js'
import { pegarPokedex } from '../controllers/pokemonController.js'

const router = Router()

router.get("/ver-sprites/:id", pegarSprites)

router.get("/pegar-pokemon/:id", pegarPokemon)

router.get("/pokedex", pegarPokedex)

export default router