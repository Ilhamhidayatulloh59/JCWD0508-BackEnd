import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { verifyToken } from "../middlewares/verify";

export class OrderRouter {
  private orderController: OrderController;
  private router: Router;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post("/", verifyToken, this.orderController.createOrder);
    this.router.post("/status", this.orderController.updateStatus)
  }

  getRouter(): Router {
    return this.router;
  }
}
