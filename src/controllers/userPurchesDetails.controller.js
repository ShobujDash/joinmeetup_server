const {
  createUserPurchesDetails,
  getUserPurchesDetailsByEvent,
  getUserPurchesDetailsByUser,
} = require("../services/userPurchesDetails.service");

const handleCreatePurchesDetails = async (req, res) => {
  try {
    const { userId, eventId, data } = req.body;

    if (!userId || !eventId || !data) {
      return res.status(400).json({success:false, message: "All fields are required." });
    }

    const response = await createUserPurchesDetails(userId, eventId, data);
    res.status(201).json({success:true, response ,message:"Purched Successfully."});
  } catch (err) {
    console.error("Error creating user purches details:", err);
    res.status(500).json({success:false, message: "Internal Server Error" });
  }
};

const handleGetPurchesDetailsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await getUserPurchesDetailsByEvent(eventId);
    res
      .status(200)
      .json({ success: true, response, message: "Get By Event Successfully." });
  } catch (err) {
    res.status(500).json({success:false, message: "Failed to fetch data." });
  }
};

const handleGetPurchesDetailsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await getUserPurchesDetailsByUser(userId);
    res
      .status(200)
      .json({ success: true, response, message: "Get By Details Successfully." });
  } catch (err) {
    res.status(500).json({success:false, message: "Failed to fetch data." });
  }
};

module.exports = {
  handleCreatePurchesDetails,
  handleGetPurchesDetailsByEvent,
  handleGetPurchesDetailsByUser,
};
