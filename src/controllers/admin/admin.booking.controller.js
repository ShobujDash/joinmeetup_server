const { getAllBookedEventsService } = require("../../services/admin/admin.booking.service");


exports.getAllBookedEventsController = async (req, res) => {
  try {
    const allBookedEvents = await getAllBookedEventsService();

    res.status(200).json({
      success: true,
      message: "All Booked Events Get successfully",
      bookedEvents: allBookedEvents,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


