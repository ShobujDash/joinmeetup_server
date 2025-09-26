const express = require("express");
const { handleCreatePurchesDetails, handleGetPurchesDetailsByEvent, handleGetPurchesDetailsByUser } = require("../controllers/userPurchesDetails.controller");
const userPurchesRouter = express.Router();



userPurchesRouter.post("/", handleCreatePurchesDetails);

userPurchesRouter.get("/event/:eventId", handleGetPurchesDetailsByEvent);

userPurchesRouter.get("/user/:userId", handleGetPurchesDetailsByUser);

module.exports = userPurchesRouter;
