const postModel = require("../post.model");

const getListPost = async ({ limit, sort, type_sort, page }) => {
  const offset = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sort] = parseInt(type_sort);

  const posts = await postModel
    .find({ isPublished: true })
    .sort(sortOptions)
    .limit(limit)
    .skip(offset)
    .exec();

  return posts;
};

const getPostById = async ({ id }) => {
  return await postModel.findOne({ _id: id, isPublished: true });
};

const getPostByIdByUser = async ({ id, user_id }) => {
  return await postModel.findOne({ _id: id, author_id: user_id });
};

const getPostByUserId = async ({ user_id, limit, sort, type_sort, page }) => {
  const offset = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sort] = parseInt(type_sort);
  return await postModel
    .find({ author_id: user_id, isPublished: true })
    .sort(sortOptions)
    .limit(limit)
    .skip(offset)
    .exec();
};

const getPostByUserIdAuth = async ({
  user_id,
  limit,
  sort,
  type_sort,
  page,
}) => {
  const offset = (page - 1) * limit;

  const sortOptions = {};
  sortOptions[sort] = parseInt(type_sort);
  return await postModel
    .find({ author_id: user_id })
    .sort(sortOptions)
    .limit(limit)
    .skip(offset)
    .exec();
};

const createPost = async ({
  location,
  user,
  content,
  video_images,
  isPublished,
}) => {
  const newPost = new postModel({
    content,
    video_images,
    isPublished,
    author_id: user,
    location,
  });

  const savedPost = await newPost.save();

  return savedPost;
};

const updatePostById = async ({ id, updateData, user_id }) => {
  return await postModel.findOneAndUpdate(
    { author_id: user_id, _id: id },
    updateData,
    {
      new: true,
    }
  );
};

const deletePostById = async ({ id, user_id }) => {
  console.log(id, user_id);
  return await postModel.findOneAndDelete({ _id: id, author: user_id });
};

module.exports = {
  getListPost,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getPostByUserId,
  getPostByIdByUser,
  getPostByUserIdAuth,
};
