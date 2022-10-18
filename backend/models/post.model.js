const mongoose = require('mongoose')
const crypto = require('crypto')
const constants = require("../utils/constants");

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
  text: { type: String, required: true },
  location: { type: String },
  picUrl: { type: String },
  likes: [{ user: { type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME } }],
  comments: [
    // by default, if we dont provide any _id, mongo db adds it by itself. But we can override that by specifying _id ourselves
    {
      _id: { type: String, required: true },
      user: { type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  created: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true })

module.exports = mongoose.model(constants.M_POST_COLLECTION_NAME, PostSchema)
