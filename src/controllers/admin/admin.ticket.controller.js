const { getAllTicketsService } = require("../../services/admin/admin.ticket.service");


exports.getAllTicketController = async (req, res) => {
  try {
    const allTicket = await getAllTicketsService();

    res.status(200).json({
      success: true,
      message: "All Ticket Get successfully",
      tickets: allTicket,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


