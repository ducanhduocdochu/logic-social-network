"use strict";

const express = require("express");
const likeController = require("../controllers/like.controller");
const asyncHandler = require("../helpers/asyncHandler");
const {
  authentication,
} = require("../controllers/middlewares/authUtils.middleware");
const router = express.Router();

// Get like in post
router.get(
  "/:post_id",
  asyncHandler(likeController.getlikeByPostId)
);

// Patch like
router.patch(
  "/:post_id",
  authentication(true),
  asyncHandler(likeController.patchLike)
);

module.exports = router;
