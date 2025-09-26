const DB = require("../../configs/dbConfig");

// Create
exports.createLogoService = async (data) => {
  return await DB.logo.create({ data });
};

// Read All
exports.getAllLogosService = async () => {
  return await DB.logo.findMany({ orderBy: { createdAt: "desc" } });
};

// Read One
exports.getSingleLogoService = async (id) => {
  const logo = await DB.logo.findUnique({ where: { id } });
  if (!logo) throw new Error("Logo not found");
  return logo;
};

// Update
exports.updateLogoService = async (id, data) => {
  return await DB.logo.update({
    where: { id },
    data,
  });
};

// Delete
exports.deleteLogoService = async (id) => {
  await DB.logo.delete({ where: { id } });
};
