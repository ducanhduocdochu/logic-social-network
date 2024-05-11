'use strict'
const { CREATED, SuccessResponse } = require('../core/success.reponse')
const FollowService = require('../services/follower.service')

class FollowController{
    updateFollow = async ( req, res, next ) => {
        new CREATED({
            message: 'Follow successfully!',
            metadata: await FollowService.updateFollow(req.params, req.user)
        }).send(res)
    }

    getFollowByUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get follow by user successfully!',
            metadata: await FollowService.getFollowByUser(req.params, req.query)
        }).send(res)
    }

    getUserFollow = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get user follow succesfully!',
            metadata: await FollowService.getUserFollow(req.params, req.query)
        }).send(res)
    }
}

module.exports = new FollowController()