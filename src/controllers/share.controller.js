'use strict'
const { CREATED, SuccessResponse, OK } = require('../core/success.reponse')
const shareService = require('../services/share.service')

class shareController{
    getshareByPostId = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list share successfully!',
            metadata: await shareService.getShareByPostId(req.params, req.query)
        }).send(res)
    }

    createshare = async ( req, res, next ) => {
        new CREATED({
            message: 'Create share successfully!',
            metadata: await shareService.createshare(req.body, req.user)
        }).send(res)
    }

    // updateshare = async ( req, res, next ) => {
    //     new OK({
    //         message: 'Update share succesfully!',
    //         metadata: await shareService.updateshare(req.params, req.body, req.user)
    //     }).send(res)
    // }

    // deleteshare = async ( req, res, next ) => {
    //     new OK({
    //         message: 'Delete share succesfully!',
    //         metadata: await shareService.deleteshare(req.params, req.user)
    //     }).send(res)
    // }
}

module.exports = new shareController()