'use strict'
const { CREATED, SuccessResponse, OK } = require('../core/success.reponse')
const PostService = require('../services/post.service')

class PostController{
    getListPost = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list post successfully!',
            metadata: await PostService.getListPost(req.query, req.user)
        }).send(res)
    }

    getPostById = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get post successfully!',
            metadata: await PostService.getPostById(req.params, req.user)
        }).send(res)
    }

    createPost = async ( req, res, next ) => {
        new CREATED({
            message: 'Create post successfully!',
            metadata: await PostService.createPost(req.body, req.user)
        }).send(res)
    }

    updatePost = async ( req, res, next ) => {
        new OK({
            message: 'Update post successfully!',
            metadata: await PostService.updatePost(req.params ,req.body, req.user)
        }).send(res)
    }

    deletePost = async ( req, res, next ) => {
        new OK({
            message: 'Delete post successfully!',
            metadata: await PostService.deletePost(req.params, req.user)
        }).send(res)
    }

    getPostForUser = async ( req, res, next ) => {
        new OK({
            message: 'Get post successfully!',
            metadata: await PostService.getPostForUser(req.query, req.params, req.user)
        }).send(res)
    }
}

module.exports = new PostController()