'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async() => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        if(!connection) {
            throw new Error("Connect fail")
        }
        const channel = await connection.createChannel()

        return {channel, connection}
    } catch(err){
        throw err
    }
}

const runProducerQueue = async(channel, queueName, message) => {
    try{
        const {channel, connection} = await connectToRabbitMQ()
        await channel.assertQueue(queueName, {
            durable: true
        })
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    } catch (err){
        console.error(err)
    }
}

module.exports = {
    connectToRabbitMQ,
    runProducerQueue
}