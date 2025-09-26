const adminAuthRouter = require("./admin.auth.route");
const adminBookingRouter = require("./admin.bookings.route");
const categoryRouter = require("./admin.categoryRouter");
const adminHeroRouter = require("./admin.hero.route");
const adminLogoRouter = require("./admin.logo.route");
const adminTicketRouter = require("./admin.tickets.route");

const adminRouter = require("express").Router();


adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/ticket", adminTicketRouter);
adminRouter.use("/bookedEvents", adminBookingRouter);

adminRouter.use("/logo", adminLogoRouter);
adminRouter.use("/hero", adminHeroRouter);
adminRouter.use("/category", categoryRouter);

module.exports = adminRouter;
