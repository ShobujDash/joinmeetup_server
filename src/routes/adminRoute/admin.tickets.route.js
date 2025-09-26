const express = require("express");
const adminTicketRouter = express.Router();


const adminAuthMiddleware = require("../../middlewares/admin.auth.middleware");
const { getAllTicketController } = require("../../controllers/admin/admin.ticket.controller");


adminTicketRouter.get("/all", getAllTicketController);

module.exports = adminTicketRouter;
