'use strict'

const express = require('express')
const uploadController = require('../controllers/upload.controller')
const asyncHandler = require('../helpers/asyncHandler')
const { uploadDisk } = require('../configs/config.multer')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const router = express.Router()

router.post('/thumb', authentication(true), uploadDisk.single('file'), asyncHandler(uploadController.uploadFileFromLocal))
router.delete('/thumb', authentication(true), asyncHandler(uploadController.deleteUploadedFile))

module.exports = router