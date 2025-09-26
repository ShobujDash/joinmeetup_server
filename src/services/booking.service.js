const DB = require("../configs/dbConfig");


const createBookingService = async function (userId, eventId) {
  // Check if booking exists
  const existingBooking = await DB.booking.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });

  if (existingBooking) {
    throw new Error("You have already booked this event.");
  }

  const booking = await DB.booking.create({
    data: {
      userId: userId,
      eventId: eventId,
    },
  });

  return booking;
};

const getBookingsByUserService = async function (userId) {
  const bookings = await DB.booking.findMany({
    where: {
      userId: userId,
    },
    include: {
      event: true, // include related event details
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const getBookingByEventIdAndUserIdService = async (userId, eventId) => {
  const booking = await DB.booking.findFirst({
    where: {
      userId,
      eventId,
    },
    include: {
      event: true, // Optional: if you want to include event details
    },
  });

  return booking;
};


module.exports = {
  createBookingService,
  getBookingsByUserService,
  getBookingByEventIdAndUserIdService,
};
