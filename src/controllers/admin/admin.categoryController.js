const { createCategoryService, getAllCategoryService, getSingleCategoryService, updateCategoryService, deleteCategoryService } = require("../../services/admin/admin.categoryService");


exports.createCategoryController = async (req, res) => {
  try {
    const body = {
      ...req.body,
      catImage: req.file?.filename || "", // handle image
    };
    const result = await createCategoryService(body);
    res
      .status(201)
      .json({ success: true, message: "Category created", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllCategoryController = async (req, res) => {
  try {
    const result = await getAllCategoryService();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSingleCategoryController = async (req, res) => {
  try {
    const result = await getSingleCategoryService(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCategoryController = async (req, res) => {
  try {
    const body = {
      ...req.body,
      ...(req.file?.filename && { catImage: req.file.filename }),
    };
    const result = await updateCategoryService(req.params.id, body);
    res
      .status(200)
      .json({ success: true, message: "Category updated", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategoryController = async (req, res) => {
  try {
    const result = await deleteCategoryService(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Category deleted", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
