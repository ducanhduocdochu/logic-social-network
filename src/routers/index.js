'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api/post', require('./post.router'))
router.use('/v1/api/noti', require('./notification.router'))
router.use('/v1/api/upload', require('./upload.router'))
router.use('/v1/api/follow', require('./follow.router'))
router.use('/v1/api/user', require('./user.router'))
router.use('/v1/api/friend', require('./friend.router'))

router.use('/v1/api/comment', require('./comment.router'))
router.use('/v1/api/like', require('./like.router'))
router.use('/v1/api/share', require('./share.router'))
router.use('/v1/api/search', require('./search.router'))

module.exports = router