"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const verify_1 = require("../middlewares/verify");
const uploader_1 = require("../services/uploader");
class BlogRouter {
    constructor() {
        this.blogController = new blog_controller_1.BlogController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.blogController.getBlogs);
        this.router.post("/", verify_1.verifyToken, verify_1.checkAdmin, (0, uploader_1.uploader)("memoryStorage", "blog-").single("thumbnail"), this.blogController.createBlog);
        this.router.get("/:slug", this.blogController.getBlogSlug);
    }
    getRouter() {
        return this.router;
    }
}
exports.BlogRouter = BlogRouter;
