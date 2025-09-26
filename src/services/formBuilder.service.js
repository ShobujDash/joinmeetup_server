const DB = require("../configs/dbConfig");


exports.createFormBuilderDataService = async ({
  eventId,
  ticketId,
  formData,
}) => {
  const result = await DB.formBuilderData.create({
    data: {
      eventId,
      ticketId,
      formData,
    },
  });

  return result;
};

exports.getFormBuilderDataService = async ({ eventId, ticketId }) => {
  return await DB.formBuilderData.findFirst({
    where: {
      eventId,
      ticketId,
    },
  });
};

// exports.updateFormBuilderDataService = async ({
//   eventId,
//   ticketId,
//   formData,
// }) => {
//   return await DB.formBuilderData.updateMany({
//     where: {
//       eventId,
//       ticketId,
//     },
//     data: {
//       formData,
//     },
//   });
// };
exports.updateFormBuilderDataService = async ({
  eventId,
  ticketId,
  formData,
}) => {
  // Check if data exists
  const existingData = await DB.formBuilderData.findFirst({
    where: {
      eventId,
      ticketId,
    },
  });

  if (existingData) {
    // If exists, update
    return await DB.formBuilderData.updateMany({
      where: {
        eventId,
        ticketId,
      },
      data: {
        formData,
      },
    });
  } else {
    // If not exists, create
    return await DB.formBuilderData.create({
      data: {
        eventId,
        ticketId,
        formData,
      },
    });
  }
};

