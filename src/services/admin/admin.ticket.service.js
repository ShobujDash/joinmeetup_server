const DB = require("../../configs/dbConfig");


exports.getAllTicketsService = async (adminId, body) => {
  try {
    const tickets = await DB.ticket.findMany();
    return tickets;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
