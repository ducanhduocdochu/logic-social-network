const { BadRequestError } = require("../../core/error.response");

const timestamp = async (req, res, next) => {
    const timestamp = parseInt(Date.now());
    const requestTimestamp = parseInt(req.headers['x-timestamp']);
    console.log(timestamp)
    console.log(requestTimestamp)
    if (requestTimestamp){
        if((requestTimestamp + 30*1000) < timestamp || requestTimestamp > timestamp){
            next(new BadRequestError('Error: Invalid request'))
        }
        return next()
    }
    console.log('AAAAAAAAAAAA')
    next(new BadRequestError('Error: Invalid request, timestamp'))
};

module.exports = {
    timestamp
};
