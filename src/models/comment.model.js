const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

var commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    author_id: {
      type: Number,
      required: true
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', 
      required: true
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    tags: {
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

module.exports = model(DOCUMENT_NAME, commentSchema);
