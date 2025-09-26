const express = require("express");
const adminAuthRouter = express.Router();

const {
  adminRegister,
  adminLogin,
  adminLogout,
  myAdmin,
  updateAdminProfile,
  getAllUsers,
  getAllAdmins,
  verifyAdminController,
} = require("../../controllers/admin/admin.auth.controller");
const upload = require("../../middlewares/uploadFileMiddleware");
const adminAuthMiddleware = require("../../middlewares/admin.auth.middleware");

adminAuthRouter.post("/register", adminRegister);
adminAuthRouter.post("/login", adminLogin);
adminAuthRouter.get("/me", adminAuthMiddleware, myAdmin);
adminAuthRouter.get("/is-auth", verifyAdminController);

adminAuthRouter.post("/logout", adminLogout);

adminAuthRouter.put(
  "/update",
  adminAuthMiddleware,
  upload.single("profileImage"),
  updateAdminProfile
);



adminAuthRouter.get("/getAllUsers", getAllUsers);
adminAuthRouter.get("/getAllAdmins", getAllAdmins);


module.exports = adminAuthRouter;
