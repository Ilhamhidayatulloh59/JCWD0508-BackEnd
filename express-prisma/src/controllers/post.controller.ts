import axios from "axios";
import { Request, Response } from "express";
import { redis } from "../services/redis";

export class PostController {
  async getPosts(req: Request, res: Response) {
    try {
      const redisData = await redis.get("posts");
      if (redisData) {
        res.status(200).send({ posts: JSON.parse(redisData) });
        return;
      }
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      await redis.setex("posts", 60, JSON.stringify(data));
      res.status(200).send({ posts: data });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
