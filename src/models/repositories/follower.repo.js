const followerModel = require("../follower.model");

const updateFollow = async ({ follower_user_id, followed_user_id }) => {
  const follow = await followerModel.findOne({
    follower_user_id,
    followed_user_id,
  });

  if (!follow) {
    return await followerModel.create({
      follower_user_id,
      followed_user_id,
      status: true,
    });
  }
  follow.status = !follow.status;
  follow.save();
  return follow;
};

const findFollow = async ({ follower_user_id, followed_user_id }) => {
  return await followerModel.findOne({ follower_user_id, followed_user_id });
};

const getFollowByUser = async ({ followed_user_id, limit, sort, type_sort, page }) => {
  const offset = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sort] = parseInt(type_sort);
  return await followerModel
    .find({ followed_user_id, status: true })
    .sort(sortOptions)
    .limit(limit)
    .skip(offset)
    .exec();
};

const getUserFollow = async ({ follower_user_id, limit, sort, type_sort, page }) => {
  const offset = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sort] = parseInt(type_sort);
  return await followerModel
    .find({ follower_user_id, status: true })
    .sort(sortOptions)
    .limit(limit)
    .skip(offset)
    .exec();
};

module.exports = {
  updateFollow,
  getFollowByUser,
  getUserFollow,
  findFollow,
};
