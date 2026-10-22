import { type Request, type Response } from "express";
import { montarTimeService } from "../services/teamBuilderService.js";
import { jogos } from "../data/jogos.js";

export async function teamBuilder(req: Request, res: Response) {
  try {
    const { jogo, objetivo } = req.body;

    console.log("Jogo recebido:", jogo);

    if (!jogo || !objetivo) {
      return res.status(400).json({
        erro: "Jogo e objetivo são obrigatórios",
      });
    }

    if (!(jogo in jogos)) {
      return res.status(400).json({
        erro: "Jogo não suportado. Escolha um dos jogos disponíveis na lista.",
      });
    }

    const resultado = await montarTimeService({
      jogo,
      objetivo,
    });

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: "Erro ao montar o time",
    });
  }
}   
