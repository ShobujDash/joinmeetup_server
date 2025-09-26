const DB = require("../../configs/dbConfig");

exports.getAllBookedEventsService = async (adminId, body) => {
  try {
    const bookings = await DB.booking.findMany();
    return bookings;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
