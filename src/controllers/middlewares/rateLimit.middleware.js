const { TooManyRequest } = require("../../core/error.response");
const { exists, expire, incr, get, pushToList } = require("../../models/redis.model");

const limitRequest = async (req, res, next) => {
    var maxRequest = 10
    try {
        const ip = req.ip;
        const userId = req.user ? req.user.user_id : null;
        let keyUser, keyIp;

        if (userId) {
            keyUser = `request_limit::${userId}`;
            console.log(keyUser);
        }

        if (ip) {
            keyIp = `request_limit::${ip}`;
            console.log(keyIp);
        }

        if (keyUser && !(await exists(keyUser))) {
            await expire(keyUser, 60); 
        }

        if (keyIp && !(await exists(keyIp))) {
            await expire(keyIp, 60); 
        }

        if (keyUser) {
            if (parseInt(await get(keyUser) > maxRequest)){
                next(new TooManyRequest('Error: Too many request, user'))
            }
            await incr(keyUser);
        }

        if (keyIp) {
            if (parseInt(await get(keyIp)) > maxRequest){
                next(new TooManyRequest('Error: Too many request, ip'))
                pushToList('blacklistip', keyIp)
            }
            await incr(keyIp);
        }

        next();
    } catch (error) {
        next(error)
    }
};

module.exports = {
    limitRequest
};
