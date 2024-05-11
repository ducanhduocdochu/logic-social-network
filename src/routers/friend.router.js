'use strict'

const express = require('express')
const friendController = require('../controllers/friend.controller')
const asyncHandler = require('../helpers/asyncHandler')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const router = express.Router()

// Lấy người friend của user
router.get('/:user_id',authentication(false), asyncHandler(friendController.getFriendByUser))



module.exports = router