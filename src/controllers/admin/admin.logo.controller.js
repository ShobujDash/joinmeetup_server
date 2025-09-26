const {
  getAllLogosService,
  createLogoService,
  getSingleLogoService,
  updateLogoService,
  deleteLogoService,
} = require("../../services/admin/admin.logo.service");

// Create
exports.createLogoController = async (req, res) => {
  try {
    const logoPath = req.file?.path; // Get uploaded file path
    if (!logoPath) throw new Error("Logo image is required");

    const result = await createLogoService({ logo: logoPath });

    res.status(201).json({
      success: true,
      message: "Logo created successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Read All
exports.getAllLogosController = async (req, res) => {
  try {
    const logos = await getAllLogosService();
    res.status(200).json({
      success: true,
      message: "All logos fetched",
      data: logos,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Read One
exports.getSingleLogoController = async (req, res) => {
  try {
    const logo = await getSingleLogoService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Logo fetched",
      data: logo,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Update
exports.updateLogoController = async (req, res) => {
  try {
    const updatedLogo = await updateLogoService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Logo updated",
      data: updatedLogo,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete
exports.deleteLogoController = async (req, res) => {
  try {
    await deleteLogoService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Logo deleted",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
