import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserMiddleware } from "../middlewares/user.middleware";

export class UserRouter {
  private router: Router;
  private userController: UserController;
  private userMiddleware: UserMiddleware;

  constructor() {
    this.userController = new UserController();
    this.userMiddleware = new UserMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.userController.getUsers);
    this.router.post("/", this.userController.addUser);

    this.router.use("/:id", this.userMiddleware.checkId);
    this.router.get("/:id", this.userController.getUserId);
    this.router.patch("/:id", this.userController.editUser);
    this.router.delete("/:id", this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
