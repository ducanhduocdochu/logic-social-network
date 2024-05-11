const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Like";
const COLLECTION_NAME = "Likes";

var likeSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, likeSchema);
