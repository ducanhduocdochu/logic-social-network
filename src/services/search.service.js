"use strict";

const { BadRequestError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const likeModel = require("../models/like.model");
const postModel = require("../models/post.model");
const { findUserByTextSearch, getNameAvatarById } = require("../models/repositories/user.repo");
const shareModel = require("../models/share.model");
class SearchService {
  static searchUser = async ({ text_search }) => {
    try {
      const users = await findUserByTextSearch({ text_search });
      return users;
    } catch (error) {
      throw new BadRequestError("Error: User not exist");
    }
  };

  static searchPost = async ({ text_search }) => {
      const posts = await postModel
        .find({ content: { $regex: new RegExp(text_search, "i") } })
        .limit(3);
      if(!posts){
        throw new BadRequestError("Error: Post not exist");
      }


      const newPosts = await Promise.all(
        posts.map(async (post) => {
          const { user_name, user_avatar } = await getNameAvatarById({
            _id: post.author_id,
          });



          post.likes = await likeModel.countDocuments({ post_id: post.id });
          post.comments = await commentModel.countDocuments({
            post_id: post.id,
          });
          post.shares = await shareModel.countDocuments({ post_id: post.id });

          const isLike = await likeModel.countDocuments({
            post_id: post.id,
            user_id: post.author_id,
          });
          if (post.share_from_user_id) {
            const foundName = await getNameAvatarById({
              _id: post.share_from_user_id,
            });
            return {
              ...post._doc,
              author_name: user_name,
              author_avatar: user_avatar,
              is_like: isLike == 1 ? true : false,
              share_from_user_name: foundName.user_name,
            };
          }

          return {
            ...post._doc,
            author_name: user_name,
            author_avatar: user_avatar,
            is_like: isLike == 1 ? true : false,
          };
        })
      );
      return newPosts;
  };
}

module.exports = SearchService;
