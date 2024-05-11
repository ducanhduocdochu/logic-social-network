'use strict'
const { SuccessResponse } = require('../core/success.reponse')
const NotificationService = require('../services/notification.service')

class NotificationController{
    listNotiByUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'Get list noti successful!',
            metadata: await NotificationService.listNotiByUser(req.query, req.user)
        }).send(res)
    } 
}

module.exports = new NotificationController()