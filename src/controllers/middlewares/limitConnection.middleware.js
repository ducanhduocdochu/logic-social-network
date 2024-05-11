const { TooManyRequest } = require("../../core/error.response");
const { get, incr, expire } = require("../../models/redis.model");

const MAX_CONNECTIONS = 1000;

const limitConnections = async (req, res, next) => {
    const currentConnections = await get("currentConnections")
    if (currentConnections) {
        if (parseInt(currentConnections) > MAX_CONNECTIONS){
            next(new TooManyRequest('Error: Too many request, user'))
        }
        await incr("currentConnections")
        next()
    } else {
        expire("currentConnections", 1000)
        next()
    }

};

module.exports = limitConnections