"use strict";

const { BadRequestError } = require("../core/error.response");
const shareModel = require("../models/share.model");
const { getNameAvatarById } = require("../models/repositories/user.repo");
const postModel = require("../models/post.model");
const { convertToObjectIdMongodb } = require("../utils");
const { createPost } = require("../models/repositories/post.repo");
const { runProducerQueue } = require("../dbs/init.rabbit");
class ShareService {
  static getShareByPostId = async (
    { post_id },
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 }
  ) => {
    try {
      const shares = await shareModel
        .find({ post_id })
        .sort({ [sort]: type_sort })
        .limit(limit)
        .skip((page - 1) * limit);

      if (!shares || shares.length === 0) return [];

      const listshare = await Promise.all(
        shares.map(async (share) => {
          const { user_name, user_avatar } = await getNameAvatarById({
            _id: share.user_id,
          });

          return {
            ...share._doc,
            user_name,
            user_avatar,
          };
        })
      );

      return listshare;
    } catch (error) {
      console.error("Error in getShareByPostId:", error);
      throw error;
    }
  };

  static createshare = async ({post_id}, {id}) => {
    const existingPost = await postModel.findOne({ _id: post_id });
    if(!existingPost){
        throw new BadRequestError("Error: Not found post");
    }

    if(id == existingPost.author_id){
      throw new BadRequestError("Error: Not share my post");
    }

    const existingSharePost = await postModel.findOne({ author_id: id, id_post_from_share: existingPost._id});
    if(existingSharePost){
        throw new BadRequestError("Error: Post has been shared");
    }

    const { _id, ...rest } = existingPost._doc;
    const newPost = await postModel.create({
        ...rest, 
        author_id: id,
        share_from_user_id: existingPost.author_id,
        id_post_from_share: _id
      });

    if (!newPost) {
      throw new BadRequestError("Error: Share post fail");
    }

    const existingShare = await shareModel.findOne({ user_id: id, post_id: _id});
    if(existingShare){
        throw new BadRequestError("Error: Post has been shared");
    }

    const newShare = await shareModel.create({
        user_id: id,
        post_id: existingPost.id
      });
      if (!newShare) {
        throw new BadRequestError("Error: Share post fail");
      }

    const { user_name, user_avatar } = await getNameAvatarById({
        _id: id,
      });
    const shareUser = await getNameAvatarById({
        _id: existingPost.author_id,
      });

    return {
        ...newPost._doc,
      author_name: user_name,
      author_avatar: user_avatar,
      share_from_user_name: shareUser.user_name
    }
  };
}
module.exports = ShareService;
