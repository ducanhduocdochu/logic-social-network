"use strict";

const { BadRequestError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const likeModel = require("../models/like.model");
const { getNameAvatarById } = require("../models/repositories/user.repo");
class LikeService {
  static getlikeByPostId = async (
    { post_id },
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 }
  ) => {
    try {
      const likes = await likeModel
        .find({  post_id })
        .sort({ [sort]: type_sort })
        .limit(limit)
        .skip((page - 1) * limit);

      if (!likes || likes.length === 0) return [];

      const listlike = await Promise.all(
        likes.map(async (like) => {
          const { user_name, user_avatar } = await getNameAvatarById({
            _id: like.user_id,
          });

          return {
            ...like._doc,
            user_name,
            user_avatar,
          };
        })
      );

      return listlike;
    } catch (error) {
      console.error("Error in getlikeByPostId:", error);
      throw error;
    }

  };

  static patchLike = async ({post_id}, {id}) => {
    try {
      const existingLike = await likeModel.findOne({ post_id, user_id: id });
      if (existingLike) {
        await likeModel.findOneAndDelete({ post_id, user_id: id });
        return { isLike: false };
      } else {
        const newLike = await likeModel.create({post_id, user_id: id});
        return { isLike: true, like: newLike };
      }
    } catch (error) {
      throw new BadRequestError("Error: Unable to patch like");
    }
  };
}
module.exports = LikeService;
