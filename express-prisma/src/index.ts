import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { UserRouter } from "./routers/user.router";
import { BlogRouter } from "./routers/blog.router";
import { AuthRouter } from "./routers/auth.router";
import cookieParser from "cookie-parser";
import path from "path";
import { PostRouter } from "./routers/post.router";
import { OrderRouter } from "./routers/order.router";

const PORT: number = 8000;

const allowedOrigins: string[] = [
  "https://blogger-fe.vercel.app",
  "http://localhost:8000",
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
};

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));
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

console.log(process.env.NODE_ENV === "production");
console.log(process.env.BASE_URL_FE);

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});
