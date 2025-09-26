const DB = require("../configs/dbConfig");

exports.followUserService = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself.");
  }

  // check if already following
  const alreadyFollowing = await DB.follow.findFirst({
    where: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  if (alreadyFollowing) {
    throw new Error("You already follow this user.");
  }

  await DB.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  return "User followed successfully.";
};

exports.unfollowUserService = async (currentUserId, targetUserId) => {
  const existing = await DB.follow.findFirst({
    where: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  if (!existing) {
    throw new Error("You are not following this user.");
  }

  await DB.follow.delete({
    where: {
      id: existing.id,
    },
  });

  return "User unfollowed successfully.";
};

exports.getFollowersService = async (userId) => {
  const followers = await DB.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return followers.map((f) => f.follower);
};

exports.getFollowingService = async (userId) => {
  const following = await DB.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return following.map((f) => f.following);
};

exports.getFollowCountService = async (userId) => {
  const [followersCount, followingCount, totalEvents] = await Promise.all([
    DB.follow.count({
      where: { followingId: userId },
    }),
    DB.follow.count({
      where: { followerId: userId },
    }),
    DB.events.count({
      where: { userId: userId },
    }),
  ]);

  return { followersCount, followingCount, totalEvents };
};

exports.checkFollowStatusService = async (userId, creatorId) => {
  const follow = await DB.follow.findFirst({
    where: {
      followerId: userId,
      followingId: creatorId,
    },
  });

  return !!follow; // true if exists, false otherwise
};