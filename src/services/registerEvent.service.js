const DB = require("../configs/dbConfig");

exports.createRegisterEventService = async (body, userId) => {
  const {
    eventId,
    ticketId,
    userJson,
    attendeeJson,
    user,
    ticketQnt,
    eventCreatorId,
  } = body;

  const ticketCount = userJson?.length || 0;
  const ticketType = [...new Set(userJson.map((u) => u.ticketType))].join(",");


  return await DB.registerEvent.create({
    data: {
      eventId,
      ticketId,
      userId,
      eventCreatorId,
      userJson,
      attendeeJson,
      ticketCount,
      ticketType,
    },
  });
};

exports.getAllRegisterEventService = async () => {
  const events = await DB.registerEvent.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      event: {
        select: {
          id: true,
          eName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return events;
};


exports.getParticipantsService = async (userId) => {
  const participants = await DB.registerEvent.findMany({
    where: { eventCreatorId: userId },
    select: {
      id: true,
      ticketCount: true,
      ticketPrice: true,
      ticketType: true,
      paymentStatus: true,
      userJson: true,
      attendeeJson: true,
      amount: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, email: true },
      },
      event: {
        select: { id: true, eName: true, eStDateAndTime: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 🔹 flat structure
  const flatParticipants = participants.map((p) => ({
    id: p.id,
    ticketCount: p.ticketCount,
    ticketPrice: p.ticketPrice,
    ticketType: p.ticketType,
    paymentStatus: p.paymentStatus,
    amount: p.amount,
    userJson: p.userJson,
    attendeeJson: p.attendeeJson,
    createdAt: p.createdAt,
    userId: p.user.id,
    userName: p.user.name,
    userEmail: p.user.email,
    eventId: p.event.id,
    eventName: p.event.eName,
    eventStart: p.event.eStDateAndTime,
  }));

  return flatParticipants;
};

exports.getParticipantsByEventIdService = async (eventId) => {
  const participants = await DB.registerEvent.findMany({
    where: { eventId: eventId },
    select: {
      id: true,
      ticketCount: true,
      ticketPrice: true,
      ticketType: true,
      paymentStatus: true,
      amount: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, email: true },
      },
      event: {
        select: { id: true, eName: true, eStDateAndTime: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 🔹 flat structure
  const flatParticipants = participants.map((p) => ({
    id: p.id,
    ticketCount: p.ticketCount,
    ticketPrice: p.ticketPrice,
    ticketType: p.ticketType,
    paymentStatus: p.paymentStatus,
    amount: p.amount,
    createdAt: p.createdAt,
    userId: p.user.id,
    userName: p.user.name,
    userEmail: p.user.email,
    eventId: p.event.id,
    eventName: p.event.eName,
    eventStart: p.event.eStDateAndTime,
  }));

  return flatParticipants;
};

exports.getTransDetailsService = async (transId) => {
  const registration = await DB.registerEvent.findFirst({
    where: { transactionId: transId },
    select: {
      id: true,
      ticketPrice: true,
      ticketCount: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          eName: true,
        },
      },
    },
  });

  if (!registration) return null;

  // Format date: 10 Jan 2025
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Date(registration.createdAt).toLocaleDateString(
    "en-GB",
    options
  );

  return {
    transactionId: registration.id,
    userId: registration.user.id,
    userName: registration.user.name,
    userEmail: registration.user.email,
    totalPrice: registration.ticketPrice,
    ticketCount: registration.ticketCount,
    createdAt: formattedDate,
    eventId: registration.event.id,
    eventName: registration.event.eName,
  };
};


exports.getRegisterEventsByEventCreatorService = async (userId) => {
  return await DB.registerEvent.findMany({
    where: {
      eventCreatorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.deleteRegisterEventByIdService = async (id) => {
  return await DB.registerEvent.delete({
    where: { id },
  });
};

exports.checkIfUserRegisteredService = async (userId, eventId) => {
  const registration = await DB.registerEvent.findFirst({
    where: {
      userId: userId,
      eventId: eventId,
    },
  });

  return !!registration; // return true if found, false if not
};

exports.getMyRegisteredEventsService = async (userId) => {
  const events = await DB.registerEvent.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      event: {
        select: {
          id: true,
          eName: true,
          hostName: true,
          banner: true,
          eStDateAndTime: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return events;
};
