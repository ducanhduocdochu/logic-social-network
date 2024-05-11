"use strict";

const express = require("express");
const shareController = require("../controllers/share.controller");
const asyncHandler = require("../helpers/asyncHandler");
const {
  authentication,
} = require("../controllers/middlewares/authUtils.middleware");
const router = express.Router();

// Get share in post
router.get(
  "/:post_id",
  asyncHandler(shareController.getshareByPostId)
);

// Create share
router.post(
  "/",
  authentication(true),
  asyncHandler(shareController.createshare)
);

// // Update share
// router.put(
//   "/:share_id",
//   authentication(true),
//   asyncHandler(shareController.updateshare)
// );

// // Delete share
// router.delete(
//   "/:share_id",
//   authentication(true),
//   asyncHandler(shareController.deleteshare)
// );

module.exports = router;
