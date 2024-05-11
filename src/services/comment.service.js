"use strict";

const { BadRequestError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { getNameAvatarById } = require("../models/repositories/user.repo");
const PostValidate = require("../validate/post.validate");

class commentService {
  static getcommentByPostId = async (
    { post_id },
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 }
  ) => {
    try {
      const comments = await commentModel
        .find({ post_id, parentComment: null })
        .sort({ [sort]: type_sort })
        .limit(limit)
        .skip((page - 1) * limit);

      if (!comments || comments.length === 0) return [];

      const listcomment = await Promise.all(
        comments.map(async (comment) => {
          const { user_name, user_avatar } = await getNameAvatarById({
            _id: comment.author_id,
          });

          const listSubComment = await commentModel.find({
            parentComment: comment._id,
          });

          const formattedSubComments = await Promise.all(
            listSubComment.map(async (subComment) => {
              const { user_name: subUserName, user_avatar: subUserAvatar } =
                await getNameAvatarById({
                  _id: subComment.author_id,
                });
              return {
                ...subComment._doc,
                author_name: subUserName,
                author_avatar: subUserAvatar,
              };
            })
          );

          return {
            ...comment._doc,
            author_name: user_name,
            author_avatar: user_avatar,
            listReplyComment: formattedSubComments,
          };
        })
      );

      return listcomment;
    } catch (error) {
      console.error("Error in getcommentByPostId:", error);
      throw error;
    }
  };

  static createComment = async (
    { content, post_id, parentComment },
    { id }
  ) => {
    const input = { content, author_id: id, post_id, parentComment };
    const { error, value } = PostValidate.CommentSchema.validate(input);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newComment = await commentModel.create({
      content: content,
      author_id: id,
      post_id: post_id,
      parentComment: parentComment,
    });

    if (!newComment) {
      throw new BadRequestError("Create comment fail");
    }

    return newComment;
  };

  static updateComment = async () => {};

  static deleteComment = async ({ post_id }, { id }) => {
    try {
      const deletedComments = await commentModel.deleteOne({
        post_id: post_id,
        user_id: id,
      });

      if (deletedComments.deletedCount === 0) {
        throw new Error("No comments found for the specified post_id.");
      }

      return deletedComments.deletedCount;
    } catch (error) {
      throw new BadRequestError("Delete comment fail");
    }
  };
}
module.exports = commentService;
