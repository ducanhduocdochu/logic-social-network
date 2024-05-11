'use strict'

const express = require('express')
const followController = require('../controllers/follow.controller')
const asyncHandler = require('../helpers/asyncHandler')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const router = express.Router()

// Cập nhật người follow
router.put('/:followed_user_id',authentication(true), asyncHandler(followController.updateFollow))

// Lấy người follow của user
router.get('/:followed_user_id', asyncHandler(followController.getFollowByUser))

// Lấy người user follow
router.get('/following/:follower_user_id', asyncHandler(followController.getUserFollow))

module.exports = router