const DB = require("../configs/dbConfig");

exports.createComment = async ({ userId, eventId, message }) => {
  return await DB.comment.create({
    data: {
      userId,
      eventId,
      message,
    },
  });
};

exports.  getCommentsByEvent = async (eventId) => {
  return await DB.comment.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


exports.deleteCommentById = async (commentId, userId) => {
  // First check if the comment belongs to the user
  const comment = await DB.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.userId !== userId) {
    return false;
  }

  await DB.comment.delete({
    where: { id: commentId },
  });

  return true;
};