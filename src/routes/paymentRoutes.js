const express = require("express");
const { sslcommerzInit, sslcommerzSuccess, sslcommerzFail, sslcommerzCancel, sslcommerzIPN } = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/auth.middleware");
const paymentRouter = express.Router();


paymentRouter.post("/checkout",authMiddleware, sslcommerzInit);
paymentRouter.post("/checkout/success", sslcommerzSuccess);
paymentRouter.post("/checkout/fail", sslcommerzFail);
paymentRouter.post("/checkout/cancel", sslcommerzCancel);
paymentRouter.post("/checkout/ipn", sslcommerzIPN);

paymentRouter.post("/checkout/pro", authMiddleware, sslcommerzInit);

module.exports = paymentRouter;
