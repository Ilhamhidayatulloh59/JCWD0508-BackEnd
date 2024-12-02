import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkAdmin, verifyToken } from "../middlewares/verify";
import { uploader } from "../middlewares/uploader";

export class UserRouter {
  private userController: UserController;
  private router: Router;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, checkAdmin, this.userController.getUsers);
    this.router.get("/profile", verifyToken, this.userController.getUserId);
    this.router.patch(
      "/avatar",
      verifyToken,
      uploader("memoryStorage", "avatar", "/avatar").single("file"),
      this.userController.editAvatar
    );
    this.router.post("/", this.userController.createUser);

    this.router.patch("/:id", this.userController.editUser);
    this.router.delete("/:id", this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
