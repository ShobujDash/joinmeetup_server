const DB = require("../configs/dbConfig");

const createUserPurchesDetails = async (userId, eventId, data) => {
  return await DB.userPurchesDetails.create({
    data: {
      userId,
      eventId,
      data,
    },
  });
};

const getUserPurchesDetailsByEvent = async (eventId) => {
  return await DB.userPurchesDetails.findMany({
    where: { eventId },
  });
};

const getUserPurchesDetailsByUser = async (userId) => {
  return await DB.userPurchesDetails.findMany({
    where: { userId },
  });
};

module.exports = {
  createUserPurchesDetails,
  getUserPurchesDetailsByEvent,
  getUserPurchesDetailsByUser,
};
