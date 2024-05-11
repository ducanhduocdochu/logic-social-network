'use strict'

const express = require('express')
const asyncHandler = require('../helpers/asyncHandler')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const notificationController = require('../controllers/notification.controller')
const router = express.Router()

// Logout
router.get('/',authentication, asyncHandler(notificationController.listNotiByUser))

module.exports = router