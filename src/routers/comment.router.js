"use strict";

const express = require("express");
const commentController = require("../controllers/comment.controller");
const asyncHandler = require("../helpers/asyncHandler");
const {
  authentication,
} = require("../controllers/middlewares/authUtils.middleware");
const router = express.Router();

// Get comment in post
router.get(
  "/:post_id",
  asyncHandler(commentController.getCommentByPostId)
);

// Create comment
router.post(
  "/",
  authentication(true),
  asyncHandler(commentController.createComment)
);

// Update comment
router.put(
  "/:comment_id",
  authentication(true),
  asyncHandler(commentController.updateComment)
);

// Delete comment
router.delete(
  "/:comment_id",
  authentication(true),
  asyncHandler(commentController.deleteComment)
);

module.exports = router;
