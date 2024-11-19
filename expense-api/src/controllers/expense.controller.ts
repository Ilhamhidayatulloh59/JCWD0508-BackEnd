import { Request, Response } from "express";
import { IExpense } from "../types/expense";
import fs from "fs";

export class ExpenseController {
  getExpense(req: Request, res: Response) {
    const { category, start, end, title } = req.query;
    let expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense.json", "utf-8")
    );

    expenses = expenses.filter((item) => {
      let isValid: boolean = true;
      if (category) {
        isValid = isValid && item.category == category;
      }
      if (title) {
        isValid = isValid && item.title.toLowerCase().includes(title as string);
      }
      if (start && end) {
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
        const expenseDate = new Date(item.date);
        isValid = isValid && expenseDate >= startDate && expenseDate <= endDate;
      }
      return isValid;
    });

    const nominal_income = expenses
      .filter((item) => item.type == "income")
      .reduce((sum, expense) => sum + expense.nominal, 0);

    const nominal_expense = expenses
      .filter((item) => item.type == "expense")
      .reduce((sum, expense) => sum + expense.nominal, 0);

    res.status(200).send({ nominal_income, nominal_expense, expenses });
  }
  getExpenseId(req: Request, res: Response) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense.json", "utf-8")
    );

    const expense = expenses.find((item) => item.id == +id);
    res.status(200).send({ expense });
  }
  addExpense(req: Request, res: Response) {
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense.json", "utf-8")
    );
    const maxId = Math.max(...expenses.map((item) => item.id));
    const id = expenses.length == 0 ? 1 : maxId + 1;
    const { title, type, nominal, category, date } = req.body;
    const newExpense = { id, title, nominal, type, category, date };
    expenses.push(newExpense);
    fs.writeFileSync("./db/expense.json", JSON.stringify(expenses), "utf-8");

    res.status(200).send("Expense added ✅");
  }
  editExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense.json", "utf-8")
    );
    const idx = expenses.findIndex((item) => item.id == +id);
    expenses[idx] = { ...expenses[idx], ...req.body };
    fs.writeFileSync("./db/expense.json", JSON.stringify(expenses), "utf-8");

    res.status(200).send(`Expense with id ${id} edited ✅`);
  }
  deleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expenses: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense.json", "utf-8")
    );
    const newExpense = expenses.filter((item) => item.id != +id);
    fs.writeFileSync("./db/expense.json", JSON.stringify(newExpense), "utf-8");

    res.status(200).send(`Expense with id ${id} deleted ✅`);
  }
}
