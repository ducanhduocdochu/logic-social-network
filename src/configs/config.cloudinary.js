'use strict'

const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dvubvnnt9', 
  api_key: '375189926762265', 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

module.exports = cloudinary