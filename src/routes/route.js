const adminRouter = require("./adminRoute/admin.route");
const authRouter = require("./authRoute");
const bookingRouter = require("./booking.route");
const commentRouter = require("./comment.routes");
const eventRouter = require("./event.routes");
const followRouter = require("./follow.route");
const formBuilderRoute = require("./formBuilder.route");
const paymentRouter = require("./paymentRoutes");
const registerEventRoute = require("./registerEvent.route");
const ticketRouter = require("./ticket.routes");
const userPurchesRouter = require("./userPurchesDetails.routes");
const router = require("express").Router();

router.use("/auth", authRouter);
router.use("/events", eventRouter);
router.use("/ticket", ticketRouter);
router.use("/follow", followRouter);
router.use("/comment", commentRouter);
router.use("/formbuilder", formBuilderRoute);
router.use("/registerEvent", registerEventRoute);

router.use("/booking", bookingRouter);
router.use("/purches", userPurchesRouter);

router.use("/admin", adminRouter);
router.use("/payment", paymentRouter);


module.exports = router;