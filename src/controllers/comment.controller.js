'use strict'
const { CREATED, SuccessResponse, OK } = require('../core/success.reponse')
const commentService = require('../services/comment.service')

class commentController{
    getCommentByPostId = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list comment successfully!',
            metadata: await commentService.getcommentByPostId(req.params, req.query)
        }).send(res)
    }

    createComment = async ( req, res, next ) => {
        new CREATED({
            message: 'Create comment successfully!',
            metadata: await commentService.createComment(req.body, req.user)
        }).send(res)
    }

    updateComment = async ( req, res, next ) => {
        new OK({
            message: 'Update comment succesfully!',
            metadata: await commentService.updateComment(req.params, req.body, req.user)
        }).send(res)
    }

    deleteComment = async ( req, res, next ) => {
        new OK({
            message: 'Delete comment succesfully!',
            metadata: await commentService.deleteComment(req.params, req.user)
        }).send(res)
    }
}

module.exports = new commentController()