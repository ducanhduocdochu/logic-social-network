"use strict";

const {
  updateFollow,
  getUserFollow,
  getFollowByUser,
  findFollow,
} = require("../models/repositories/follower.repo");
const { BadRequestError } = require("../core/error.response");
const { findUserById, getNameAvatarById } = require("../models/repositories/user.repo");
const { updateFriend } = require("../models/repositories/friend.repo");
const NotificationService = require("./notification.service");

class FollowerService {
  static updateFollow = async (
    { followed_user_id },
    { id }
  ) => {
    // --------------------------------------------------
    // Lấy người dùng được follow
    // --------------------------------------------------
    if(followed_user_id == id){
      throw new BadRequestError("Error: Invalid request");
    }
    const foundUser = await findUserById({ _id: followed_user_id });
    if (!foundUser) {
      throw new BadRequestError("Error: Not found User");
    }

    // --------------------------------------------------
    // Update follow
    // --------------------------------------------------
    const newFollow = await updateFollow({
      follower_user_id: id,
      followed_user_id: foundUser.id,
    });

    if (!newFollow) {
      throw new BadRequestError("Error: Create follow fail");
    }

    // --------------------------------------------------
    // Trường hợp set friend
    // --------------------------------------------------

    // --------------------------------------------------
    // Trường hợp tạo ra follow, check follow của user còn lại, set friend
    // --------------------------------------------------
    if (newFollow.status) {
      let inverseFollow = await findFollow({
        follower_user_id: newFollow.followed_user_id,
        followed_user_id: newFollow.follower_user_id,
      });
      if(inverseFollow){
        if (inverseFollow.status) {
          let setFriendFollowerUser = await updateFriend({
            id: newFollow.follower_user_id,
            friend_user_id: newFollow.followed_user_id,
            isAdd: true
          });
          let setFriendFollowedUser = await updateFriend({
            id: newFollow.followed_user_id,
            friend_user_id: newFollow.follower_user_id,
            isAdd: true
          });
  
          if(!setFriendFollowerUser || !setFriendFollowedUser){
            throw new BadRequestError("Error: Create follow fail");
          }

          const {user_name} = await getNameAvatarById({_id: newFollow.followed_user_id})
          await NotificationService.pusNotiToSystem({ id: newFollow.followed_user_id, user_name, type: "ACCEPT FRIEND" }, {follower_user_id: newFollow.follower_user_id});
        }else{
          const {user_name} = await getNameAvatarById({_id: newFollow.followed_user_id})
          await NotificationService.pusNotiToSystem({ id: newFollow.followed_user_id, user_name, type: "ADD FRIEND" }, {follower_user_id: newFollow.follower_user_id});
        }
      }else{
      const {user_name} = await getNameAvatarById({_id: newFollow.followed_user_id})
      await NotificationService.pusNotiToSystem({ id: newFollow.followed_user_id, user_name, type: "ADD FRIEND" }, {follower_user_id: newFollow.follower_user_id});
      }
    }else if(!newFollow.status){
      let inverseFollow = await findFollow({
        follower_user_id: newFollow.followed_user_id,
        followed_user_id: newFollow.follower_user_id,
      });
      if (inverseFollow){
          let setFriendFollowerUser = await updateFriend({
            id: newFollow.follower_user_id,
            friend_user_id: newFollow.followed_user_id,
            isAdd: false
          });
          let setFriendFollowedUser = await updateFriend({
            id: newFollow.followed_user_id,
            friend_user_id: newFollow.follower_user_id,
            isAdd: false
          });
  
          if(!setFriendFollowerUser || !setFriendFollowedUser){
            throw new BadRequestError("Error: Create follow fail");
          }
      }
    }
    return newFollow;
  };

  static getFollowByUser = async (
    { followed_user_id },
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 }
  ) => {
    const listFollow = await getFollowByUser({
      followed_user_id,
      limit,
      sort,
      type_sort,
      page,
    });

    if (!listFollow) {
      throw new BadRequestError("Error: Create follow fail");
    }

    const newFollows = await Promise.all(
      listFollow.map(async (follow) => {
        const {user_avatar, user_name} = await getNameAvatarById({
          _id: follow.follower_user_id,
        });

        return {
          ...follow._doc,
          follower_user_name: user_name,
          follower_user_avatar: user_avatar,
        };
      })
    );
    return newFollows;
  };

  static getUserFollow = async (
    { follower_user_id },
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 }
  ) => {
    const newFollow = await getUserFollow({ follower_user_id, limit, sort, type_sort, page });

    if (!newFollow) {
      throw new BadRequestError("Error: Create follow fail");
    }

    return newFollow;
  };
}
module.exports = FollowerService;
