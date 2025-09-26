const DB = require("../configs/dbConfig");

exports.createTicketService = async (eventId, data) => {
  const existingTicket = await DB.ticket.findFirst({
    where: { eventId: eventId },
  });

  if (existingTicket) {
    throw new Error("Ticket already exists for this event");
  }

  return await DB.ticket.create({
    data: {
      eventId: eventId,
      startSelling: new Date(data.startSelling),
      stopSelling: new Date(data.stopSelling),
      totalTickets: data.totalTickets,
      maxTicketsPerOrder: data.maxTicketsPerOrder,
      sellFeesToBuyer: data.sellFeesToBuyer,
      hasTablesOrGroups: data.hasTablesOrGroups || false,
      limitToOne: data.limitToOne || false,
      ticketTypes: data.ticketTypes, // must be array of objects
    },
  });
};

exports.getTicketService = async (eventId) => {
  return await DB.ticket.findFirst({
    where: { eventId },
  });
};

exports.editTicketService = async (ticketId, data) => {
  return await DB.ticket.update({
    where: { id: ticketId },
    data: {
      startSelling: new Date(data.startSelling),
      stopSelling: new Date(data.stopSelling),
      totalTickets: data.totalTickets,
      maxTicketsPerOrder: data.maxTicketsPerOrder,
      sellFeesToBuyer: data.sellFeesToBuyer,
      hasTablesOrGroups: data.hasTablesOrGroups || false,
      limitToOne: data.limitToOne || false,
      ticketTypes: data.ticketTypes, // array of objects
    },
  });
};
