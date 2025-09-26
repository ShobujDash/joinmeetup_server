const express = require("express");
const { followUserController, unfollowUserController, getFollowersController, getFollowingController, getFollowCountController, checkFollowStatusController } = require("../controllers/follow.controller");
const authMiddleware = require("../middlewares/auth.middleware");


const followRouter = express.Router();

// Requires authentication middleware to populate req.user.id
followRouter.post("/follow/:id",authMiddleware, followUserController);
followRouter.delete("/unfollow/:id",authMiddleware, unfollowUserController);
followRouter.get("/followers",authMiddleware, getFollowersController);
followRouter.get("/following",authMiddleware, getFollowingController);

followRouter.get("/count/:userId", getFollowCountController);
followRouter.get(
  "/status/:creatorId",
  authMiddleware,
  checkFollowStatusController
);

module.exports = followRouter;
