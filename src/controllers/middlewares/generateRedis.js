const redisClient = require("../../configs/config.redis");

const generateRedisClient = (req, res, next) => {
    req.redisClient = redisClient;
    next();
};

module.exports = generateRedisClient;