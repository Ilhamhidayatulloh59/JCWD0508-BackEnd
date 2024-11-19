import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";

export class ExpenseRouter {
  private expenseController: ExpenseController;
  private router: Router;

  constructor() {
    this.expenseController = new ExpenseController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.expenseController.getExpense);
    this.router.post("/", this.expenseController.addExpense);

    this.router.get("/:id", this.expenseController.getExpenseId);
    this.router.patch("/:id", this.expenseController.editExpense);
    this.router.delete("/:id", this.expenseController.deleteExpense);
  }

  getRouter(): Router {
    return this.router;
  }
}
