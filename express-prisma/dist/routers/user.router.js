"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const verify_1 = require("../middlewares/verify");
const uploader_1 = require("../services/uploader");
class UserRouter {
    constructor() {
        this.userController = new user_controller_1.UserController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", verify_1.verifyToken, verify_1.checkAdmin, this.userController.getUsers);
        this.router.get("/profile", verify_1.verifyToken, this.userController.getUserId);
        this.router.post("/", this.userController.createUser);
        this.router.patch("/avatar", verify_1.verifyToken, (0, uploader_1.uploader)("diskStorage", "avatar-", "/avatar").single("file"), this.userController.editAvatar);
        this.router.patch("/avatar-cloud", verify_1.verifyToken, (0, uploader_1.uploader)("memoryStorage", "avatar").single("file"), this.userController.editAvatarCloud);
        this.router.patch("/:id", this.userController.editUser);
        this.router.delete("/:id", this.userController.deleteUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
