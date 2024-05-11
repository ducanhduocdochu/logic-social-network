const { BadRequestError } = require("../../core/error.response");
const { exists, expire } = require("../../models/redis.model");

const nonce = async (req, res, next) => {
    if(req.headers['x-nonce']){
        if (await exists(req.headers['x-nonce'])){
            next(new BadRequestError('Error: Request has sent'))
        } 
        await expire(req.headers['x-nonce'], 100000000)
        return next()
    }
    next(new BadRequestError('Error: Invalid request, nonce'))
};

module.exports = {
    nonce
};
