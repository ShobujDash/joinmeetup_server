const express = require("express");
const adminBookingRouter = express.Router();


const adminAuthMiddleware = require("../../middlewares/admin.auth.middleware");
const { getAllBookedEventsController } = require("../../controllers/admin/admin.booking.controller");


adminBookingRouter.get("/all", getAllBookedEventsController);

module.exports = adminBookingRouter;
