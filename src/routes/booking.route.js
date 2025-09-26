const express = require("express");
const bookingRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  createBookingController,
  getMyBookingsController,
  getBookedEventByEventIdAndUserIdController,
} = require("../controllers/booking.controller");

bookingRouter.post("/", authMiddleware, createBookingController);
bookingRouter.get("/my", authMiddleware, getMyBookingsController);
bookingRouter.get("/:eventId", authMiddleware, getBookedEventByEventIdAndUserIdController);


module.exports = bookingRouter;

