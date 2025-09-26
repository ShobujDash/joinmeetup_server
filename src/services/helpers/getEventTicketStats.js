const DB = require("../../configs/dbConfig");

exports.getEventTicketStats = async (eventId) => {
  try {
    const tickets = await DB.ticket.findMany({
      where: { eventId },
      select: { totalTickets: true },
    });

    if (!tickets || tickets.length === 0) {
      return {
        totalTickets: 0,
        totalBookings: 0,
        totalIncome: 0,
        totalMember: 0,
      };
    }

    const totalTickets = tickets.reduce(
      (sum, ticket) => sum + ticket.totalTickets,
      0
    );

    const totalBookings = await DB.registerEvent.count({
      where: { eventId },
    });

    const registrations = await DB.registerEvent.findMany({
      where: { eventId, paymentStatus: "Paid" },
      select: { ticketPrice: true, ticketCount: true},
    });

    const totalIncome = registrations.reduce(
      (sum, reg) => sum + parseFloat(reg.ticketPrice || 0),
      0
    );

    const totalMember = registrations.reduce(
      (sum, reg) => sum + (reg.ticketCount || 0),
      0
    );

    return {
      totalTickets,
      totalBookings,
      totalIncome,
      totalMember,
    };
  } catch (error) {
    console.error("Error in getEventTicketStats:", error);
    throw error;
  }
};
