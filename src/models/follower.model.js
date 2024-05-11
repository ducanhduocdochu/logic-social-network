'use strict'

const {Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'Follower'
const COLLECTION_NAME = 'Followers'

var followerSchema = new Schema({
    follower_user_id: {
        type: Number,
        required: true
    },
    followed_user_id: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamp: true
});

module.exports = model(DOCUMENT_NAME, followerSchema);