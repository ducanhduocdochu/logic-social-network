"use strict";
const Joi = require("joi");

class PostValidate {
  static Postschema = Joi.object({
    content: Joi.string().required().empty().messages({
      "any.required": "Error: Invalid request, content is required",
      "string.empty": "Error: Invalid request, content must not be empty",
    }),
    video_images: Joi.array().items(Joi.string()).messages({
      "array.base": "Error: Invalid request, video_images must be an array",
      "array.includesRequiredUnknowns":
        "Error: Invalid request, all elements in video_images must be strings",
    }),
    isPublished: Joi.boolean().messages({
      "boolean.base": "Error: Invalid request, isPublished must be a boolean",
    }),
    location: Joi.string(),
  });

  static CommentSchema = Joi.object({
    content: Joi.string().required().empty().messages({
      "any.required": "Error: Invalid comment, content is required",
      "string.empty": "Error: Invalid comment, content must not be empty",
    }),
    author_id: Joi.number().required().messages({
      "any.required": "Error: Invalid comment, author_id is required",
      "number.base": "Error: Invalid comment, author_id must be a number",
    }),
    post_id: Joi.string().required().messages({
      "any.required": "Error: Invalid comment, post_id is required",
      "string.base": "Error: Invalid comment, post_id must be a string",
    }),
    parentComment: Joi.string().allow(null).messages({
      "string.base":
        "Error: Invalid comment, parentComment must be a string or null",
    }),
  });
}

module.exports = PostValidate;
