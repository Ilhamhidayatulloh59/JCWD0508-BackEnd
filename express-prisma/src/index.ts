import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRouter } from "./routers/user.router";
import { BlogRouter } from "./routers/blog.router";
import { AuthRouter } from "./routers/auth.router";
import cookieParser from "cookie-parser";
import path from "path";
import { PostRouter } from "./routers/post.router";
import { OrderRouter } from "./routers/order.router";

const PORT: number = 8000;

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.BASE_URL_FE,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my API");
});

app.use("/api/public", express.static(path.join(__dirname, "../public")));

const userRouter = new UserRouter();
const blogRouter = new BlogRouter();
const authRouter = new AuthRouter();
// const postRouter = new PostRouter();
const orderRouter = new OrderRouter();

app.use("/api/users", userRouter.getRouter());
app.use("/api/blogs", blogRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
// app.use("/api/posts", postRouter.getRouter());
app.use("/api/orders", orderRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});
