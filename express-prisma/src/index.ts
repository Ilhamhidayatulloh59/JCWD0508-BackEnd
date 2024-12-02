import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRouter } from "./routers/user.router";
import { BlogRouter } from "./routers/blog.router";
import { AuthRouter } from "./routers/auth.router";
import cookieParser from "cookie-parser";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my API");
});

const userRouter = new UserRouter();
const blogRouter = new BlogRouter();
const authRouter = new AuthRouter();

app.use("/api/users", userRouter.getRouter());
app.use("/api/blogs", blogRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});

export default app;
