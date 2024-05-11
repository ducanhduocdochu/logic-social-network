const friendModel = require("../friend.model");

const updateFriend = async ({ id, friend_user_id, isAdd }) => {
  if (isAdd){
    let foundFriend = await friendModel.findOne({
      user_id: id,
    });
    if(!foundFriend){
      foundFriend = await friendModel.create({
        user_id: id,
        list_friends: [{user_id: friend_user_id}],
      });
    }else{
      foundFriend.list_friends = [...foundFriend.list_friends, {user_id: friend_user_id}]
      foundFriend.save()
    }
    return foundFriend
  }else{
    let foundFriend = await friendModel.findOne({
      user_id: id,
    });
    foundFriend.list_friends = foundFriend.list_friends.filter(friend => {
      return friend.user_id != friend_user_id
    });
    foundFriend.save()
    return foundFriend
  }
};

const getFriendByUser = async ({ user_id, limit, sort, type_sort, page }) => {
  const offset = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sort] = parseInt(type_sort);
  return await friendModel
    .findOne({ user_id })
    .sort(sortOptions)
    .limit(limit)
    .skip(offset)
    .exec();
};


module.exports = {
  updateFriend,
  getFriendByUser
};
