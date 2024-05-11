'use strict'
const { CREATED, SuccessResponse, OK } = require('../core/success.reponse')
const LikeService = require('../services/like.service')

class LikeController{
    getlikeByPostId = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list like successfully!',
            metadata: await LikeService.getlikeByPostId(req.params, req.query)
        }).send(res)
    }

    patchLike = async ( req, res, next ) => {
        new CREATED({
            message: 'Patch like successfully!',
            metadata: await LikeService.patchLike(req.params, req.user)
        }).send(res)
    }
}

module.exports = new LikeController()