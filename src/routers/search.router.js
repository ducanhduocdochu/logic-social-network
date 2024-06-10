"use strict";

const express = require("express");
const searchController = require("../controllers/search.controller");
const asyncHandler = require("../helpers/asyncHandler");

const router = express.Router();

router.get(
  "/post",
  asyncHandler(searchController.searchPost)
);

router.get(
  "/user",
  asyncHandler(searchController.searchUser)
);

module.exports = router;
