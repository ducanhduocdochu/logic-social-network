
const crypto = require('crypto');
const { BadRequestError } = require("../../core/error.response");

const signature = async (req, res, next) => {
    // 
    const key = "ducanh"
    
    const string = req.headers['x-nonce']  + req.headers['x-timestamp'] + key
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(string);
    const hmacResult = hmac.digest('hex');
    const signatureServer = req.headers['x-signature']

    if (signatureServer){
        if(signatureServer != hmacResult){
            next(new BadRequestError('Error: Invalid payload'))
        }
        return next()
    }
    next(new BadRequestError('Error: Invalid request, signature'))
};

module.exports = {
    signature
};
