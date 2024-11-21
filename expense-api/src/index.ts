import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { ExpenseRouter } from "./routers/expense.router";
import pool from "./config/db";
import { ExpenseV2Router } from "./routers/expenseV2.router";

const PORT: number = 8000;
const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my expense api");
});

const expenseRouter = new ExpenseRouter();
const expensev2Router = new ExpenseV2Router();

app.use("/api/expense", expenseRouter.getRouter());
app.use("/api/v2/expense", expensev2Router.getRouter());

pool.connect((err, client, release) => {
  if (err) {
    return console.log("Error acquiring client", err.stack);
  }
  if (client) {
    client.query("SET search_path TO test", (queryErr) => {
      if (queryErr) {
        console.log("Error setting search path", queryErr.stack);
      } else {
        console.log('Success connection "test" ✅');
      }
      release();
    });
  }
});

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});
