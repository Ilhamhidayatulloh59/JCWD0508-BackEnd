import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.userController.getUsers);
    this.router.get("/:id", this.userController.getUserId)
    this.router.post("/", this.userController.addUser)
  }

  getRouter(): Router {
    return this.router;
  }
}
