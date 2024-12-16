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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const user_service_1 = require("../services/user.service");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailer_1 = require("../services/mailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword, username, email } = req.body;
                if (password != confirmPassword)
                    throw { message: "Password not match!" };
                const user = yield (0, user_service_1.findUser)(username, email);
                if (user)
                    throw { message: "username or email has been used !" };
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPasword = yield (0, bcrypt_1.hash)(password, salt);
                const newUser = yield prisma_1.default.user.create({
                    data: { username, email, password: hashPasword },
                });
                const payload = { id: newUser.id, role: newUser.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "10m" });
                const link = `${process.env.BASE_URL_FE}/verify/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", "verify.hbs");
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ username, link });
                yield mailer_1.transporter.sendMail({
                    from: "ilham@purwadhika.com",
                    to: email,
                    subject: "Welcome to Blogger 🙌",
                    html,
                });
                res.status(201).send({ message: "Register Successfully ✅" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const user = yield (0, user_service_1.findUser)(data, data);
                if (!user)
                    throw { message: "Account not found !" };
                if (user.isSuspend)
                    throw { message: "Account Suspended !" };
                if (!user.isVerify)
                    throw { message: "Account Not Verify !" };
                const isValidPass = yield (0, bcrypt_1.compare)(password, user.password);
                if (!isValidPass) {
                    yield prisma_1.default.user.update({
                        data: { loginAttempt: { increment: 1 } },
                        where: { id: user.id },
                    });
                    if (user.loginAttempt == 2) {
                        yield prisma_1.default.user.update({
                            data: { isSuspend: true },
                            where: { id: user.id },
                        });
                    }
                    throw { message: "Incorrect Password !" };
                }
                yield prisma_1.default.user.update({
                    data: { loginAttempt: 0 },
                    where: { id: user.id },
                });
                const payload = { id: user.id, role: user.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "1d" });
                res
                    .status(200)
                    .setHeader("Cache-Control", "no-store")
                    .cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 24 * 3600 * 1000,
                    path: "/",
                    domain: "blogger-fe.vercel.app",
                })
                    .send({
                    message: "Login Sucessfully ✅",
                    user,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const verifiedUser = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
                yield prisma_1.default.user.update({
                    data: { isVerify: true },
                    where: { id: verifiedUser.id },
                });
                res.status(200).send({ message: "Verify Successfully" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.AuthController = AuthController;
