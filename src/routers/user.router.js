'use strict'

const express = require('express')
const userController = require('../controllers/user.controller')
const asyncHandler = require('../helpers/asyncHandler')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const router = express.Router()

// Lấy thông tin người dùng
router.get('/', authentication(true), asyncHandler(userController.getInfoUser))

// Lấy thông tin người qua id
router.get('/:id', asyncHandler(userController.getInfoUserById))

module.exports = router