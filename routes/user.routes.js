const router = require("express").Router();
const {
  REGISTER_USER,
  LOGIN_USER,
  UPDATE_USER,
  AUTO_LOGIN,
  LOGOUT_USER
} = require("../controller/user.controller");

router.post("/register", REGISTER_USER);
router.post("/login", LOGIN_USER);
router.get("/login/auto", AUTO_LOGIN);
router.patch("/update/:id", UPDATE_USER);
router.delete("/logout", LOGOUT_USER);

module.exports = router;