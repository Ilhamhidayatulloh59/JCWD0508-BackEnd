"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
class PostRouter {
    constructor() {
        this.postController = new post_controller_1.PostController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.postController.getPosts);
    }
    getRouter() {
        return this.router;
    }
}
exports.PostRouter = PostRouter;
