import { Router } from "express";
import ejwt from "express-jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, User } from "../db";

const router = Router();
const SECRET = process.env.JWT_SECRET!;

function delay(d = Math.random() * 500) {
  return new Promise(resolve => setTimeout(() => resolve(d), d));
}

function signUser(user: User) {
  const sign = jwt.sign(
    {
      user: user.username,
      type: user.type,
    },
    SECRET,
    { expiresIn: "30d" }
  );
  return sign;
}

/* GET users listing. */
router.post("/user/login", async function (req, res) {
  // Timing Hack
  await delay();
  const { email, hash: password } = req.body;

  const user = await UserModel.findOne({ email });
  if (user) {
    const match = await bcrypt.compare(password, user.pass);

    if (match) {
      const sign = signUser(user);
      res.setHeader("Authorization", "Bearer " + sign);
      return res.json({ code: 200, username: user.username });
    }
  }
  return res.json({ code: 403, message: "login failed" });
});

/* 用户注册 */
router.post("/user/signup", async function ({ body: { email, username, hash } }, res) {
  if (!email || !username || !hash) return res.json({ code: 400, message: "invalid input" });
  const user = await UserModel.findOne({ email });
  if (user) return res.json({ code: 403, message: "user exists" });

  const pass = await bcrypt.hash(hash, 11);

  const newUser = new UserModel({ email, username, pass, type: 1 });
  await newUser.save();

  const sign = signUser(newUser);
  res.setHeader("Authorization", "Bearer " + sign);
  return res.json({ code: 200, username: newUser.username });
});

/**
 * 校验是否登录
 * test:
 * $nuxt.$axios.get("/api/user/check",{headers:{Authorization:$nuxt.$store.state.app.auth}})
 */
router.get("/user/check", ejwt({ secret: SECRET, algorithms: ["HS256"] }), function (req: any, res) {
  if (!req.user) return res.status(403).json({ code: 403, message: "not login" });
  return res.json({ code: 200 });
});

export default router;
