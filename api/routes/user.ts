import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel, UserAvatarModel, UserWeaponModel, UserAvatar, UserWeapon } from "../db";
import { delay, PROTECTED, signUser } from "../util";
import type { IUserAvatar, IUserWeapon } from "~/modules/core";

const router = Router();

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
router.get("/user/check", PROTECTED, function (req, res) {
  if (!req.user) return res.status(403).json({ code: 403, message: "not login" });
  return res.json({ code: 200 });
});

router.get("/user/char", PROTECTED, async function (req, res) {
  if (!req.user) return res.status(403).json({ code: 403, message: "not login" });
  const avatar = await UserAvatarModel.find({ owner: req.user.uid });
  return res.json(avatar);
});

router.put("/user/char", PROTECTED, async function (req, res) {
  const newData: IUserAvatar = req.body;
  const user = await UserModel.findById(req.user.uid);
  if (!user) return res.json({ code: 403, message: "user not found" });

  const avatar = await UserAvatarModel.findOne({ owner: user.id, avatarId: newData.avatarId });
  // 不存在则新建
  if (!avatar) {
    const newAvatar: UserAvatar = {
      owner: user,
      avatarId: newData.avatarId,
      level: newData.level,
      promoteLevel: newData.promoteLevel,
      talentLevel: newData.talentLevel,
      attackLevel: newData.attackLevel,
      eLevel: newData.eLevel,
      qLevel: newData.qLevel,
      weapon: newData.weapon,
    };
    const userData = new UserAvatarModel(newAvatar);
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
router.delete("/user/char/:id", PROTECTED, async function (req, res) {
  const id = req.params.id;
  if (!id) return res.json({ code: 400, message: "bad request" });
  const user = await UserModel.findById(req.user.uid);
  if (!user) return res.json({ code: 403, message: "user not found" });

  await UserAvatarModel.findOneAndDelete({ owner: user.id, avatarId: id });

  return res.json({ code: 200 });
});

router.get("/user/weapon", PROTECTED, async function (req, res) {
  if (!req.user) return res.status(403).json({ code: 403, message: "not login" });
  const avatar = await UserWeaponModel.find({ owner: req.user.uid });
  return res.json(avatar);
});

router.put("/user/weapon", PROTECTED, async function (req, res) {
  const newData: IUserWeapon = req.body;
  const user = await UserModel.findById(req.user.uid);
  if (!user) return res.json({ code: 403, message: "user not found" });

  const weapon = await UserWeaponModel.findOne({ owner: user.id, weaponId: newData.weaponId });
  // 不存在则新建
  if (!weapon) {
    const newWeapon: UserWeapon = {
      owner: user,
      weaponId: newData.weaponId,
      level: newData.level,
      promoteLevel: newData.promoteLevel,
      refineLevel: newData.refineLevel,
    };
    const userData = new UserWeaponModel(newWeapon);
    await userData.save();
  } else {
    // 存在则更新
    weapon.weaponId = newData.weaponId;
    weapon.level = newData.level;
    weapon.promoteLevel = newData.promoteLevel;
    weapon.refineLevel = newData.refineLevel;
    await weapon.save();
  }

  return res.json({ code: 200 });
});

router.delete("/user/weapon/:id", PROTECTED, async function (req, res) {
  const id = req.params.id;
  if (!id) return res.json({ code: 400, message: "bad request" });
  const user = await UserModel.findById(req.user.uid);
  if (!user) return res.json({ code: 403, message: "user not found" });

  await UserWeaponModel.findOneAndDelete({ owner: user.id, weaponId: id });

  return res.json({ code: 200 });
});

export default router;
