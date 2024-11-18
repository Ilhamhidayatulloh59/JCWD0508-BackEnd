import { Request, Response } from "express";
import fs from "fs";
import { IUser } from "../types/user";

export class UserController {
  getUsers(req: Request, res: Response) {
    const { name } = req.query;
    let users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );

    if (name) {
      users = users.filter((item) =>
        item.name.toLowerCase().includes(name as string)
      );
    }

    res.status(200).send({ users });
  }
  getUserId(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const data = users.find((item) => item.id == +id);
    res.status(200).send({ user: data });
  }
  addUser(req: Request, res: Response) {
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const maxId = Math.max(...users.map((item) => item.id));
    const id = users.length == 0 ? 1 : maxId + 1;
    const { name, email, password } = req.body;
    const newData: IUser = { id, name, email, password };
    users.push(newData);

    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8");

    res.status(201).send({ user: newData });
  }
  editUser(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const idx: number = users.findIndex((item) => item.id == +id);
    users[idx] = { ...users[idx], ...req.body };

    fs.writeFileSync("./db/users.json", JSON.stringify(users), "utf-8");

    res.status(200).send("edit succesfully!");
  }
  deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const users: IUser[] = JSON.parse(
      fs.readFileSync("./db/users.json", "utf-8")
    );
    const newUsers = users.filter((item) => item.id != +id);

    fs.writeFileSync("./db/users.json", JSON.stringify(newUsers), "utf-8");

    res.status(200).send("Delete Successfully!");
  }
}
