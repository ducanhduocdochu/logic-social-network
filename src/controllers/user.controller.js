'use strict'
const { SuccessResponse } = require('../core/success.reponse')
const UserService = require('../services/user.service')


class PostController{
    getInfoUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get info user successfully!',
            metadata: await UserService.getInfoUser(req.user)
        }).send(res)
    }

    getInfoUserById = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get info user successfully!',
            metadata: await UserService.getInfoUserById(req.params)
        }).send(res)
    }
}

module.exports = new PostController()