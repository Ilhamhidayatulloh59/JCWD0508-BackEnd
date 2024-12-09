import express, { Application } from "express";
import { UserRouter } from "./routers/user.router";
import { PokemonRouter } from "./routers/pokemon.router";

const PORT: number = 8000;
const app: Application = express();
app.use(express.json());

const userRouter = new UserRouter();
const pokemonRouter = new PokemonRouter();

app.use("/api/users", userRouter.getRouter());
app.use("/api/pokemons", pokemonRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on => http://localhost:${PORT}/api`);
});

export default app;
