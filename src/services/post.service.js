"use strict";
const { ObjectId } = require("mongodb");
const { BadRequestError } = require("../core/error.response");

const {
  getListPost,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getPostByUserId,
  getPostByIdByUser,
  getPostByUserIdAuth,
} = require("../models/repositories/post.repo");
const PostValidate = require("../validate/post.validate");
const NotificationService = require("./notification.service");
const { getNameAvatarById } = require("../models/repositories/user.repo");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");
const shareModel = require("../models/share.model");

class PostService {
  static getListPost = async (
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 },
    user
  ) => {
    // --------------------------------------------------
    // Lấy list post
    // --------------------------------------------------
    if (user) {
      // --------------------------------------------------
      // Lấy list post theo service recommned
      // --------------------------------------------------
      const posts = await getListPost({ limit, sort, type_sort, page });
      if (!posts) {
        throw new BadRequestError("Error: Empty list post");
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

          const isLike = await likeModel.countDocuments({post_id: post.id, user_id: user.id})
          if(post.share_from_user_id){
            const foundName = await getNameAvatarById({
              _id: post.share_from_user_id,
            });
            return {
              ...post._doc,
              author_name: user_name,
              author_avatar: user_avatar,
              is_like: isLike == 1 ? true : false,
              share_from_user_name: foundName.user_name
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
    }
    // --------------------------------------------------
    // Lấy list post nổi bật
    // --------------------------------------------------
    // const posts = await getListPost({ limit, sort, type_sort, page });
    // if (!posts) {
    //   throw new BadRequestError("Error: Empty list post");
    // }

    // return {
    //     posts,
    // };
  };

  static getPostById = async ({ id }, user) => {
    // --------------------------------------------------
    // Lấy post
    // --------------------------------------------------
    if (user) {
      // --------------------------------------------------
      // Nếu post của user, lấy hết
      // --------------------------------------------------
      const post = await getPostByIdByUser({ id, user_id: user.id });

      if (!post) {
        // --------------------------------------------------
        // Nếu post của người khác, lấy public
        // --------------------------------------------------
        const post = await getPostById({ id });
      }
      const { user_name, user_avatar } = await getNameAvatarById({
        _id: post.author_id,
      });

      return {
        ...post._doc,
        author_name: user_name,
        author_avatar: user_avatar,
      };
    }
    // --------------------------------------------------
    // Nếu post không auth, lấy hết public
    // --------------------------------------------------
    const post = await getPostById({ id });
    if (!post) {
      throw new BadRequestError("Error: Post not exist");
    }

    return post;
  };

  static getPostForUser = async (
    { limit = 10, sort = "createdAt", type_sort = 1, page = 1 },
    { id },
    user
  ) => {
    // --------------------------------------------------
    // Lấy post
    // --------------------------------------------------
    var posts;
    if (user && id == user.id) {
      posts = await getPostByUserIdAuth({
        user_id: id,
        limit,
        sort,
        type_sort,
        page,
      });

      const { user_name, user_avatar } = await getNameAvatarById({
        _id: id,
      });
      const newPosts = await Promise.all(
        posts.map(async (post) => {
          post.likes = await likeModel.countDocuments({ post_id: post.id });
          post.comments = await commentModel.countDocuments({
            post_id: post.id,
          });
          post.shares = await shareModel.countDocuments({ post_id: post.id });
          return {
            ...post._doc,
            author_name: user_name,
            author_avatar: user_avatar,
          };
        })
      );

      if (!posts) {
        throw new BadRequestError("Error: Post not exist");
      }
      return newPosts;
    }

    posts = await getPostByUserId({
      user_id: id,
      limit,
      sort,
      type_sort,
      page,
    });
    if (!posts) {
      throw new BadRequestError("Error: Post not exist");
    }

    const { user_name, user_avatar } = await getNameAvatarById({
      _id: id,
    });
    const newPosts = await Promise.all(
      posts.map(async (post) => {
        post.likes = await likeModel.countDocuments({ post_id: post.id });
        post.comments = await commentModel.countDocuments({ post_id: post.id });
        post.shares = await shareModel.countDocuments({ post_id: post.id });
        // if(!post.share_from_user_id) {
        //   const share_from_user_name = await get({ post_id: post.id });
        // }
        return {
          ...post._doc,
          author_name: user_name,
          author_avatar: user_avatar,
        };
      })
    );

    return newPosts;
  };

  static createPost = async (
    { content, video_images, isPublished, location },
    user
  ) => {
    // --------------------------------------------------
    // Validate
    // --------------------------------------------------
    const user_id = user.id;
    const input = { content, video_images, isPublished, location };
    const { error, value } = PostValidate.Postschema.validate(input);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // --------------------------------------------------
    // Tạo post
    // --------------------------------------------------
    const post = await createPost({
      user: user_id,
      content,
      video_images,
      isPublished,
      location,
    });
    if (!post) {
      throw new BadRequestError("Error: Create post fail");
    }

    const { user_name, user_avatar } = await getNameAvatarById({
      _id: user_id,
    });

    // await NotificationService.pusNotiToSystem({ id: user_id, type: "NEW POST" });

    return {
      ...post._doc,
      author_name: user_name,
      author_avatar: user_avatar,
    };
  };

  static updatePost = async (
    { id },
    { content, video_images, isPublished, location },
    user
  ) => {
    // --------------------------------------------------
    // Validate
    // --------------------------------------------------
    const input = { content, video_images, isPublished, location };
    const { error, value } = PostValidate.Postschema.validate(input);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // --------------------------------------------------
    // Thực hiện cập nhật bài viết
    // --------------------------------------------------
    const updatedPost = await updatePostById({
      id,
      updateData: input,
      user_id: user.id,
    });

    if (!updatedPost) {
      throw new BadRequestError("Error: Update post fail");
    }

    const { user_name, user_avatar } = await getNameAvatarById({
      _id: updatedPost.author_id,
    });

    return {
      ...updatedPost._doc,
      author_name: user_name,
      author_avatar: user_avatar,
    };
  };

  static deletePost = async ({ id }, user) => {
    // --------------------------------------------------
    // Thực hiện xóa bài viết
    // --------------------------------------------------
    const deletedPost = await deletePostById({ id, user_id: user.id });

    if (!deletedPost) {
      throw new BadRequestError("Error: Delete post fail");
    }
    return;
    deletedPost;
  };
}

module.exports = PostService;
