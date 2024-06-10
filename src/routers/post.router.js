'use strict'

const express = require('express')
const postController = require('../controllers/post.controller')
const asyncHandler = require('../helpers/asyncHandler')
const { authentication } = require('../controllers/middlewares/authUtils.middleware')
const router = express.Router()

// Get list post, có auth thì lấy theo service recommend, không có thì public
router.get('/', authentication(false) ,asyncHandler(postController.getListPost))

// // Get post by id, có auth thì (id post của mình thì lấy tất cả), id post không của mình lấy public
router.get('/:post_id', authentication(false), asyncHandler(postController.getPostById))

// // Create post, bất buộc auth
router.post('/', authentication(true), asyncHandler(postController.createPost))

// // Get post for user, nếu post của user, lấy hết, nếu của người khác, lấy public
router.get('/user/:id', authentication(false), asyncHandler(postController.getPostForUser))

// // Update post
router.put('/:id', authentication(true), asyncHandler(postController.updatePost))

// // Delete post
router.delete('/:id', authentication(true), asyncHandler(postController.deletePost))

module.exports = router