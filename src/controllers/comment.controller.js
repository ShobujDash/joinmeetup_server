const { createComment, getCommentsByEvent, deleteCommentById } = require("../services/comment.service");


exports.createCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, message } = req.body;

    if (!eventId || !message) {
      return res.status(400).json({
        success: false,
        message: "Event ID and comment message are required.",
      });
    }

    const comment = await createComment({ userId, eventId, message });

    res.status(201).json({
      success: true,
      message: "Comment added successfully!",
      comment,
    });
  } catch (error) {
    console.error("Create Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getCommentsByEventController = async (req, res) => {
  try {
    const { eventId } = req.params;

    const comments = await getCommentsByEvent(eventId);

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.deleteCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;

    const deleted = await deleteCommentById(commentId, userId);

    if (!deleted) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
