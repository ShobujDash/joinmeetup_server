const DB = require("../../configs/dbConfig");

exports.createCategoryService = async (data) => {
  return await DB.category.create({ data });
};

exports.getAllCategoryService = async () => {
  return await DB.category.findMany({ orderBy: { createdAt: "desc" } });
};

exports.getSingleCategoryService = async (id) => {
  return await DB.category.findUnique({ where: { id } });
};

exports.updateCategoryService = async (id, data) => {
  return await DB.category.update({ where: { id }, data });
};

exports.deleteCategoryService = async (id) => {
  return await DB.category.delete({ where: { id } });
};
