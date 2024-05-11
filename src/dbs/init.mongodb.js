'use strict'
const mongoose = require("mongoose")
const {countConnect} = require('../helpers/check.connect')
const { dbM: {host,
    port,
    name,
    username,
    password,
    authentication} } = require('../configs/config.database')
    
// const connectString = `mongodb://${username}:${password}@${host}:${port}/?authSource=${authentication}/${name}`
const connectString = `mongodb://${host}:${port}/${name}`
class Database {
    constructor(){
        this.connect()
    }
    // connect
    connect(type = 'mongodb'){
        if(1 == 0){
            mongoose.set('debug', true)
            mongoose.set('debug', {color :true})
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then( _ => {
            countConnect()
            console.log(`Connected Mongodb Success`)
            })
        .catch(err => console.log(`Error Connect`, err))

    }
    static getInstance(){
        if (!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}
const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb