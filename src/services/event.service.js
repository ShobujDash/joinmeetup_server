const DB = require("../configs/dbConfig");
const { getEventTicketStats } = require("./helpers/getEventTicketStats");

exports.createEvent = async (data) => {
  const { isOnline, tremsAndCon, userId, ...rest } = data;

  const totalEvents = await DB.events.count({ where: { userId } });

  const newEvent = await DB.events.create({
    data: {
      ...rest,
      isOnline: isOnline === true || isOnline === "true",
      tremsAndCon: tremsAndCon === true || tremsAndCon === "true",
      userId,
    },
  });

  if (totalEvents === 0) {
    await DB.user.update({
      where: { id: userId },
      data: { role: "eventCreator" },
    });
  }

  return newEvent;
};

exports.updateEventService = async (eventId, data) => {
  try {
    const updatedEvent = await DB.events.update({
      where: { id: eventId },
      data,
    });
    return updatedEvent;
  } catch (error) {
    console.error("updateEventService Error:", error);
    throw error;
  }
};

exports.getAllEvents = async (number) => {
  try {
    const events = await DB.events.findMany({
      where: {
        isPublish: true,
      },
      take: number > 0 ? number : undefined,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        tickets: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const stats = await getEventTicketStats(event.id);
        return {
          ...event,
          ...stats, 
        };
      })
    );

    return eventsWithStats;
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    throw error;
  }
};

exports.publishEventService = async (eventId, isPublish) => {
  try {
    const updatedEvent = await DB.events.update({
      where: { id: eventId },
      data: { isPublish },
    });
    return updatedEvent;
  } catch (error) {
    console.error("publishEventService Error:", error);
    throw error;
  }
};

exports.getEventsByCategoryService = async function (categoryName) {
  try {
    const events = await DB.events.findMany({
      where: {
        category: { equals: categoryName, mode: "insensitive" },
        isPublish: true,
      },
      include: { creator: true, tickets: true },
      orderBy: { createdAt: "desc" },
    });

    return events;
  } catch (err) {
    console.error("getEventsByCategoryService Error:", err);
    throw err;
  }
};


exports.getEventsByUser = async (userId) => {
  return await DB.events.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      tickets: true,
    },
  });
};

exports.getEventById = async (eventId) => {
  try {
    const event = await DB.events.findUnique({
      where: { id: eventId },
      include: { creator: true },
    });

    if (!event) {
      return null;
    }

    const data = await getEventTicketStats(eventId);

    return {
      ...event,
      ...data,
    };
  } catch (error) {
    console.error("Error in getEventById:", error);
    throw error;
  }
};

exports.getTotalEventCountByUser = async (userId) => {
  const count = await DB.events.count({
    where: {
      userId: userId,
    },
  });

  return count;
};

exports.deleteEvent = async (eventId) => {
  return await DB.events.delete({
    where: { id: eventId },
  });
};
