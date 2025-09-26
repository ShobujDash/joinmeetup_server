const express = require("express");

const upload = require("../../middlewares/uploadFileMiddleware");
const { createHeroController, getAllHeroController, getSingleHeroController, deleteHeroController } = require("../../controllers/admin/admin.hero.controller");
const adminHeroRouter = express.Router();



// Create
adminHeroRouter.post("/", upload.single("image"), createHeroController);

// Read all
adminHeroRouter.get("/", getAllHeroController);

// Read one
adminHeroRouter.get("/:id", getSingleHeroController);

// Delete
adminHeroRouter.delete("/:id", deleteHeroController);

module.exports = adminHeroRouter;
