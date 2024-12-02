import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign } from "jsonwebtoken";

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { password, confirmPassword, username, email } = req.body;
      if (password != confirmPassword) throw { message: "Password not match!" };

      const user = await findUser(username, email);
      if (user) throw { message: "username or email has been used !" };

      const salt = await genSalt(10);
      const hashPasword = await hash(password, salt);

      await prisma.user.create({
        data: { username, email, password: hashPasword },
      });
      res.status(201).send({ message: "Register Successfully ✅" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { message: "Account not found !" };
      if (user.isSuspend) throw { message: "Account Suspended !" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) {
        await prisma.user.update({
          data: { loginAttempt: { increment: 1 } },
          where: { id: user.id },
        });
        if (user.loginAttempt == 2) {
          await prisma.user.update({
            data: { isSuspend: true },
            where: { id: user.id },
          });
        }
        throw { message: "Incorrect Password !" };
      }

      await prisma.user.update({
        data: { loginAttempt: 0 },
        where: { id: user.id },
      });

      const payload = { id: user.id, role: user.role };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 3600 * 1000,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
        .send({
          message: "Login Sucessfully ✅",
          user,
        });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
