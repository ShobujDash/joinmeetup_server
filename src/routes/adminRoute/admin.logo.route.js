const express = require("express");
const { createLogoController, getAllLogosController, getSingleLogoController, updateLogoController, deleteLogoController } = require("../../controllers/admin/admin.logo.controller");
const upload = require("../../middlewares/uploadFileMiddleware");
const adminLogoRouter = express.Router();



// Create Logo
adminLogoRouter.post("/create",upload.single("image"), createLogoController);

// Get all Logos
adminLogoRouter.get("/all", getAllLogosController);

// Get single Logo
adminLogoRouter.get("/:id", getSingleLogoController);

// Update Logo
adminLogoRouter.patch("/:id", updateLogoController);

// Delete Logo
adminLogoRouter.delete("/:id", deleteLogoController);

module.exports = adminLogoRouter;
