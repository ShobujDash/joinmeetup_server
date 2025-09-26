const express = require("express");
const {  createTicketController, getTicketController, editTicketController } = require("../controllers/ticket.controller");
const ticketRouter = express.Router();


ticketRouter.post("/:eventId", createTicketController);
ticketRouter.get("/:eventId", getTicketController);
ticketRouter.put("/:ticketId", editTicketController);

module.exports = ticketRouter;
