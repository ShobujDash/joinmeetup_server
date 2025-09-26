const {
  createRegisterEventService,
  getAllRegisterEventService,
  getRegisterEventByIdService,
  deleteRegisterEventByIdService,
  checkIfUserRegisteredService,
  getMyRegisteredEventsService,
  getParticipantsService,
  getParticipantsByEventIdService,
  getTransDetailsService,
} = require("../services/registerEvent.service");

exports.createRegisterEvent = async (req, res) => {
  try {
    const data = await createRegisterEventService(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllRegisterEvents = async (req, res) => {
  try {
    const data = await getAllRegisterEventService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRegisterEventById = async (req, res) => {
  try {
    const data = await getRegisterEventByIdService(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.participants = async (req, res) => {
  try {
    const data = await getParticipantsService(req.user.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.participantsByEventId = async (req, res) => {
  try {
    const data = await getParticipantsByEventIdService(req.params.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransDetails = async (req, res) => {
  try {
    const { transId } = req.params;
    const data = await getTransDetailsService(transId);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.checkIfUserRegisteredController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const isRegistered = await checkIfUserRegisteredService(userId, eventId);

    res.status(200).json({
      success: true,
      isRegistered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyRegisteredEventsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const registeredEvents = await getMyRegisteredEventsService(userId);

    res.status(200).json({
      success: true,
      message: "Fetched registered events successfully",
      registeredEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch registered events",
      error: error.message,
    });
  }
};

exports.deleteRegisterEventById = async (req, res) => {
  try {
    await deleteRegisterEventByIdService(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
