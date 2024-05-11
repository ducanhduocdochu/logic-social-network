"use strict";

const {
} = require("../models/repositories/follower.repo");
const { BadRequestError } = require("../core/error.response");
const { getFriendByUser } = require("../models/repositories/friend.repo");
const { getNameAvatarById } = require("../models/repositories/user.repo");

class FriendService {
  static getFriendByUser = async (
    { user_id },
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 }
  ) => {
    const friendUser = await getFriendByUser({
      user_id,
      limit,
      sort,
      type_sort,
      page,
    });

    if (!friendUser) {
      throw new BadRequestError("Error: Create follow fail");
    }

    const listfriend = await Promise.all(
      friendUser.list_friends.map(async (friend) => {
        const {user_name, user_avatar} = await getNameAvatarById({ _id: friend.user_id });
        return {
          ...friend._doc,
          user_name,
          user_avatar,
        };
      })
    );

    return listfriend;
  };
}
module.exports = FriendService;
