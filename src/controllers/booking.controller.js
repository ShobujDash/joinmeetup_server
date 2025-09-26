const { createBookingService, getBookingsByUserService, getBookingByEventIdAndUserIdService } = require("../services/booking.service");



exports.createBookingController = async (req, res) => {
  try {
    const userId = req.user.id; // ⛔ Make sure auth middleware sets `req.user`
    const { eventId } = req.body;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID is required" });
    }

    const booking = await createBookingService(userId, eventId);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// ⬇️ get Booking Controller
exports.getMyBookingsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookingsData = await getBookingsByUserService(userId);
    const bookings = bookingsData.map((booking) => booking.event);

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


exports.getBookedEventByEventIdAndUserIdController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const booking = await getBookingByEventIdAndUserIdService(userId, eventId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking found for this event by the user.",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

