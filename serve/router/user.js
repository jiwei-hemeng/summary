import jwt from "jsonwebtoken";
import express from "express";
import { secretKey, userList } from "../utils/jwtOtion.js";
const router = express.Router();
router.post("/login", (req, res) => {
  let users = {};
  for (let item of userList) {
    users[item.loginCode] = item;
  }
  if (
    users[req.body.username] &&
    users[req.body.username].pwd === req.body.password
  ) {
    res.json({
      code: 200,
      message: "登录成功",
      token:
        "Bearer " +
        jwt.sign(
          { username: req.body.username, ...users[req.body.username] },
          secretKey,
          {
            expiresIn: "2h",
          }
        ),
    });
  } else {
    res.json({
      code: 200,
      message: "登录失败",
    });
  }
});
export default router;
