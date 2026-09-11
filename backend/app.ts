import express from "express";
import type { Request, Response, NextFunction } from "express";
import  pokemonRoutes  from './src/routers/pokemonRoutes.js'
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(morgan("tiny"));

// Permite requisições ao front-end
app.use(cors());

// segurança
app.use(helmet());

// Permite que o Express receba JSON
app.use(express.json());

app.use("/api", pokemonRoutes);

// Rota utilizada para verificar se a API está funcionando
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    mensagem: "API funcionando!",
  });
});

// Executado quando nenhuma rota é encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    erro: "Erro interno do servidor",
    mensagem: error.message,
  });
});

export default app;