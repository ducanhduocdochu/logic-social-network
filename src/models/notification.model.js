'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema({
  noti_type: {type: String, enum: ['NEW POST', 'ADD FRIEND', 'ACCEPT FRIEND']},
  noti_senderId: {type: Number, require: true},
  noti_receivedId: {type: Number, require: true},
  noti_seen: {type: Boolean, default: false},
  option: {type: Object, default: {}},
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, notificationSchema);
