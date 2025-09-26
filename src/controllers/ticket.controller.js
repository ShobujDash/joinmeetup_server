const { createTicketService, getTicketService, editTicketService } = require("../services/ticket.service");


exports.createTicketController = async (req, res) => {
  try {
    const { eventId } = req.params;
    const ticketData = req.body;

    const newTicket = await createTicketService(eventId, ticketData);

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

exports.getTicketController = async (req, res) => {
  try {
    const { eventId } = req.params;

    const ticket = await getTicketService(eventId);

    if (!ticket) {
      return res.status(200).json({
        success: false,
        message: "Ticket not found for this event",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

exports.editTicketController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const updatedData = req.body;

    const updatedTicket = await editTicketService(ticketId, updatedData);

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or update failed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};
