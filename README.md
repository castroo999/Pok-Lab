# PokéLab

PokéLab é uma aplicação web para explorar Pokémon, montar equipes para diferentes jogos da série e jogar um desafio de palavras inspirado no Termo.

## Funcionalidades

- **Pokédex:** busca por nome, filtro por região e navegação paginada.
- **Montador de times:** gera uma equipe de até seis Pokémon de acordo com o jogo e o objetivo selecionados.
- **Times salvos:** guarda equipes no armazenamento local do navegador e permite removê-las.
- **PokéTermo:** desafio de seis tentativas com teclado físico ou virtual. Escolha uma região, adivinhe um Pokémon daquela Pokédex e inicie novas rodadas quando quiser.
- Interface adaptada para desktop, tablet e celular, com fontes e visual pixel art do PokéLab.

## Tecnologias

- React 19, TypeScript e Vite
- React Router e Lucide React
- Node.js, Express e TypeScript no backend
- PokéAPI para dados de Pokémon
- `localStorage` para salvar equipes neste navegador

## Requisitos

- Node.js e npm
- Acesso à internet para consultar a PokéAPI

## Instalação

Instale as dependências do frontend na raiz do projeto:

```bash
npm install
```

Instale as dependências do backend:

```bash
cd backend
npm install
```

## Executar em desenvolvimento

Abra um terminal na pasta `backend` e inicie a API:

```bash
npm run dev
```

A API inicia por padrão em `http://localhost:3000`. Para mudar a porta, defina a variável de ambiente `PORT`.

Em outro terminal, volte à pasta raiz e inicie o frontend:

```bash
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. Durante o desenvolvimento, o Vite encaminha as chamadas `/api` para `http://localhost:3000`.

Para usar uma API hospedada, crie um arquivo `.env` na raiz do frontend com a URL base:

```env
VITE_API_URL=https://sua-api.exemplo.com
```

O frontend acrescenta `/api` às rotas da API. O PokéTermo consulta as Pokédexes regionais diretamente na PokéAPI.

## Comandos úteis

Na raiz do projeto:

```bash
npm run dev      # inicia o frontend
npm run build    # verifica os tipos e gera a versão de produção
npm run preview  # serve localmente a versão gerada
npm run lint     # executa o ESLint
```

No diretório `backend`:

```bash
npm run dev      # inicia a API com recarga automática
npm run build    # compila o backend TypeScript
npm start        # inicia a versão compilada
```

## Estrutura do projeto

```text
src/
  components/    Componentes compartilhados e controles
  data/          Dados usados pelo frontend
  lib/           Utilitários, incluindo a URL da API
  pages/         Pokédex, montador, times salvos e PokéTermo
  types/         Tipos do frontend
backend/
  src/controllers/  Controladores das rotas
  src/data/         Regras e dados do backend
  src/routers/      Rotas HTTP
  src/services/     Integração com a PokéAPI e lógica de times
```

Os times ficam no `localStorage` do navegador em uso; eles não são sincronizados entre dispositivos.
