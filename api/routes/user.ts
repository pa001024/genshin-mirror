import { Router } from "express";
import jwt from "express-jwt";
import bcrypt from "bcrypt";
import jwtc from "jsonwebtoken";
import { User } from "../db/models";

const router = Router();
const SECRET = "e8cf4d7d05ec7625fd1152dfada33e55";

/* GET users listing. */
router.post("/user/login", async function (req, res, _next) {
  const { email, hash: password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.json({ code: 401 });
    res.sendStatus(401);
    return;
  }
  const match = await bcrypt.compare(password, user.hash);

  if (match) {
    const sign = jwtc.sign(
      {
        user: user.name,
        email: user.email,
        type: user.type,
      },
      SECRET,
      { expiresIn: "30d" }
    );
    console.log(sign);
    res.setHeader("Authorization", "Bearer " + sign);
  }
  res.json({ code: 200 });
});

/* GET user by ID. */
// router.get("/users/:id", function ({ params: { id } }, res, _next) {
//   const uid = parseInt(id);
//   if (uid === 1) res.json({ id: 1, name: "s" });
//   res.sendStatus(404);
// });

/* GET check user is login. */
router.get("/user/check", jwt({ secret: SECRET, algorithms: ["HS256"] }), function (req: any, res, _next) {
  if (!req.user) return res.sendStatus(401);
  res.sendStatus(200);
});

export default router;
