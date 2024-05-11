const { ForbiddenError } = require("../../core/error.response");
const { valueExistsInList } = require("../../models/redis.model");

const blacklist = async (req, res, next) => {
    const key = `request_limit::${req.ip}`
    const valueExists = await valueExistsInList('blacklistip', key)
    if(valueExists){
        next(new ForbiddenError("User in blacklist"))
    }
    return next()
};

module.exports = blacklist