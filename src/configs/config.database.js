'use strict'
const dev = {
    app: {port: process.env.DEV_APP_PORT},
    dbM: {
        host: process.env.DEV_DB_HOST_MONGO,
        port: process.env.DEV_DB_PORT_MONGO,
        name: process.env.DEV_DB_NAME_MONGO,
        username: process.env.DEV_DB_USERNAME_MONGO,
        password: process.env.DEV_DB_PASSWORD_MONGO,
        authentication: process.env.DEV_DB_AUTHENTICATION_MONGO
    },
    dbP: {
        host: process.env.DEV_DB_HOST_POSTGRE,
        port: process.env.DEV_DB_PORT_POSTGRE,
        name: process.env.DEV_DB_NAME_POSTGRE,
        username: process.env.DEV_DB_USERNAME_POSTGRE,
        password: process.env.DEV_DB_PASSWORD_POSTGRE,
    },
}

const pro = {
    app: {port: process.env.PRO_APP_PORT},
    db: {
        host: process.env.PRO_DB_HOST,
        port: process.env.PRO_DB_PORT, 
        name: process.env.PRO_DB_NAME,
        username: process.env.PRO_DB_USERNAME,
        password: process.env.PRO_DB_PASSWORD,
        authentication: process.env.PRO_DB_AUTHENTICATION 
    }
}

const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]