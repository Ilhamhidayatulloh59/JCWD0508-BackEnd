"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = require("./routers/user.router");
const blog_router_1 = require("./routers/blog.router");
const auth_router_1 = require("./routers/auth.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const order_router_1 = require("./routers/order.router");
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.BASE_URL_FE,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/api", (req, res) => {
    res.status(200).send("Welcome to my API");
});
app.use("/api/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
const userRouter = new user_router_1.UserRouter();
const blogRouter = new blog_router_1.BlogRouter();
const authRouter = new auth_router_1.AuthRouter();
// const postRouter = new PostRouter();
const orderRouter = new order_router_1.OrderRouter();
app.use("/api/users", userRouter.getRouter());
app.use("/api/blogs", blogRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
// app.use("/api/posts", postRouter.getRouter());
app.use("/api/orders", orderRouter.getRouter());
app.listen(PORT, () => {
    console.log(`server running on -> http://localhost:${PORT}/api`);
});
