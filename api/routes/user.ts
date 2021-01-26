import { Router } from "express";
import ejwt from "express-jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DocumentType } from "@typegoose/typegoose";
import { UserModel, User, UserAvatarModel } from "../db";
import { IUserAvatar } from "~/modules/core";

const router = Router();
const SECRET = process.env.JWT_SECRET!;

const PROTECTED = ejwt({ secret: SECRET, algorithms: ["HS256"] });

function delay(d = Math.random() * 500) {
  return new Promise(resolve => setTimeout(() => resolve(d), d));
}

interface JWTPayload {
  id: string;
  user: string;
  type: number;
}

function signUser(user: DocumentType<User>) {
  const payload: JWTPayload = { id: user.id, user: user.username!, type: user.type! };
  const sign = jwt.sign(payload, SECRET, { expiresIn: "30d" });
  return sign;
}

/* GET users listing. */
router.post("/user/_id", async function (req, res) {
  const id = req.params.id;
  const u = await UserModel.findById(id);
  if (u) {
    return res.json({ code: 200, data: u });
  }
  return res.json({ code: 404, message: "not found" });
});

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
  if (!email || !username || !hash || username.length > 40 || email.length > 80) return res.json({ code: 400, message: "invalid input" });
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
router.get("/user/check", PROTECTED, function (req: any, res) {
  if (!req.user) return res.status(403).json({ code: 403, message: "not login" });
  return res.json({ code: 200 });
});

router.put("/user/char", PROTECTED, async function (req, res) {
  const newData: IUserAvatar = req.body.data;
  const jwtPayload = (req as any) as JWTPayload;
  const user = await UserModel.findById(jwtPayload.id);
  if (!user) return res.json({ code: 403, message: "not login" });

  const avatar = await UserAvatarModel.findOne({ owner: user.id, avatarId: newData.avatarId });
  // 不存在则新建
  if (!avatar) {
    const userData = new UserAvatarModel({ ...newData });
    await userData.save();
  } else {
    // 存在则更新
    avatar.avatarId = newData.avatarId;
    avatar.level = newData.level;
    avatar.promoteLevel = newData.promoteLevel;
    avatar.talentLevel = newData.talentLevel;
    avatar.attackLevel = newData.attackLevel;
    avatar.eLevel = newData.eLevel;
    avatar.qLevel = newData.qLevel;
    avatar.weapon = newData.weapon;
    // avatar.artifacts = newData.artifacts;
    await avatar.save();
  }

  return res.json({ code: 200 });
});

export default router;
