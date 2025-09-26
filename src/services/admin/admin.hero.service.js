const DB = require("../../configs/dbConfig");

// Create
exports.createHeroService = async (data) => {
  return await DB.hero.create({ data });
};

// Get all
exports.getAllHeroService = async () => {
  return await DB.hero.findMany({ orderBy: { createdAt: "desc" } });
};

// Get one
exports.getSingleHeroService = async (id) => {
  const hero = await DB.hero.findUnique({ where: { id } });
  if (!hero) throw new Error("Hero not found");
  return hero;
};


// Delete
exports.deleteHeroService = async (id) => {
  await DB.hero.delete({ where: { id } });
};
