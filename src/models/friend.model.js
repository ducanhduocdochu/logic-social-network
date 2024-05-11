const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Friend";
const COLLECTION_NAME = "Friends";

var FriendSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true
    },
    list_friends: {
      type: [
        {
          user_id: {type: Number, required: true},
        },
      ],
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, FriendSchema);
