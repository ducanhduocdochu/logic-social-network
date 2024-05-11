const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Post';
const COLLECTION_NAME = 'Posts';

var postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author_id: {
    type: Number,
    required: true
  },
  video_images: [{
    type: String,
  }],
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  location: {
    type: String
  },
  share_from_user_id: {
    type: Number,
    default: null
  },
  id_post_from_share: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, postSchema);
