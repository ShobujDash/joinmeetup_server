const commentRouter = require("express").Router();
const { createCommentController, getCommentsByEventController, deleteCommentController } = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");


commentRouter.post("/create", authMiddleware, createCommentController);
commentRouter.get("/event/:eventId", getCommentsByEventController);
commentRouter.delete("/:commentId", authMiddleware, deleteCommentController);


module.exports = commentRouter;
