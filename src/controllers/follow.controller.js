const {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  getFollowCountService,
  checkFollowStatusService,
} = require("../services/follow.service");

exports.followUserController = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const message = await followUserService(currentUserId, targetUserId);
    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.unfollowUserController = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const message = await unfollowUserService(currentUserId, targetUserId);
    res.status(200).json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getFollowersController = async (req, res) => {
  try {
    const followers = await getFollowersService(req.user.id);
    res.status(200).json({ success: true, followers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFollowingController = async (req, res) => {
  try {
    const following = await getFollowingService(req.user.id);
    res.status(200).json({ success: true, following });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getFollowCountController = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      followersCount,
      followingCount,
      totalEvents,
    } = await getFollowCountService(userId);

    res.status(200).json({
      success: true,
      followers: followersCount,
      following: followingCount,
      events: totalEvents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};


exports.checkFollowStatusController = async (req, res) => {
  try {
    const userId = req.user.id;
    const creatorId = req.params.creatorId;

    const isFollowing = await checkFollowStatusService(userId, creatorId);

    res.status(200).json({
      success: true,
      isFollowing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
