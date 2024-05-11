const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Share";
const COLLECTION_NAME = "Shares";

var shareSchema = new Schema(
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

module.exports = model(DOCUMENT_NAME, shareSchema);
