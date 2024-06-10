'use strict'
const { SuccessResponse } = require('../core/success.reponse')
const SearchService = require('../services/search.service')

class SearchController{
    searchPost = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get post successfully!',
            metadata: await SearchService.searchPost(req.query)
        }).send(res)
    }

    searchUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get user successfully!',
            metadata: await SearchService.searchUser(req.query)
        }).send(res)
    }
}

module.exports = new SearchController()