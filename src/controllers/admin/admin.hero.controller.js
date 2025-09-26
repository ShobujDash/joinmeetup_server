const { createHeroService, getAllHeroService, getSingleHeroService, deleteHeroService } = require("../../services/admin/admin.hero.service");


// Create
exports.createHeroController = async (req, res) => {
  try {
    const { title, des, btn } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const hero = await createHeroService({ title, des, btn, image });

    res.status(201).json({
      success: true,
      message: "Hero created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all
exports.getAllHeroController = async (req, res) => {
  try {
    const heroes = await getAllHeroService();
    res.status(200).json({
      success: true,
      message: "All hero entries fetched",
      data: heroes,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get single
exports.getSingleHeroController = async (req, res) => {
  try {
    const hero = await getSingleHeroService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Hero entry fetched",
      data: hero,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};


// Delete
exports.deleteHeroController = async (req, res) => {
  try {
    await deleteHeroService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Hero entry deleted",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
