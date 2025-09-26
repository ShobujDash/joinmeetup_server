const express = require("express");
const authRouter = express.Router();
const { register, login, myAuth, logout, updateProfile, createUsersController, google, verifyOtp } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/uploadFileMiddleware");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/google", google);
authRouter.get("/me",authMiddleware, myAuth);
authRouter.post("/logout", logout);
authRouter.post("/createUsers", createUsersController);

authRouter.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile
);


module.exports = authRouter;
