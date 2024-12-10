"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../services/redis");
class PostController {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const redisData = yield redis_1.redis.get("posts");
                if (redisData) {
                    res.status(200).send({ posts: JSON.parse(redisData) });
                    return;
                }
                const { data } = yield axios_1.default.get("https://jsonplaceholder.typicode.com/posts");
                yield redis_1.redis.setex("posts", 60, JSON.stringify(data));
                res.status(200).send({ posts: data });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.PostController = PostController;
