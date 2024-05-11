'use strict'
const { SuccessResponse } = require('../core/success.reponse')
const FriendService = require('../services/friend.service')

class FriendController{
    getFriendByUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get friend by user successfully!',
            metadata: await FriendService.getFriendByUser(req.params, req.query)
        }).send(res)
    }
}

module.exports = new FriendController()