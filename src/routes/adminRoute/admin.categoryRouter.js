const express = require("express");
const upload = require("../../middlewares/uploadFileMiddleware");
const { createCategoryController, getAllCategoryController, getSingleCategoryController, updateCategoryController, deleteCategoryController } = require("../../controllers/admin/admin.categoryController");

const categoryRouter = express.Router();

categoryRouter.post("/", upload.single("catImage"), createCategoryController);
categoryRouter.get("/", getAllCategoryController);
categoryRouter.get("/:id", getSingleCategoryController);
categoryRouter.patch(
  "/:id",
  upload.single("catImage"),
  updateCategoryController
);
categoryRouter.delete("/:id", deleteCategoryController);

module.exports = categoryRouter;
