const mongoose = require('mongoose')
const crypto = require('crypto')
const constants = require("../utils/constants")

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required.'
  },
  tagline: {
    type: String,
  },
  description: {
    type: String,
    required: 'Title is required.'
  },
  level: {
    type: String,
    trim: true,
    required: 'Level is required.'
  },
  courseCode: {
    type: String,
    required: 'Course code is required.',
    unique: 'Course code already exists.',
  },
  coursePhoto: {
    data: Buffer,
    contentType: String
  },
  gallery: 
    [
      {
    contentType: String,
    data: Buffer,
    created: { type: Date, default: Date.now },
    postedBy: {type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME}
      }
    ],
  students: [{type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME}],
  comments: 
    [
      {
    text: String,
    created: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME}
      }
    ],
  instructor: String,
  created: {
    type: Date,
    default: Date.now
  },
  videos: [
    {
      videoId: Number,
      title: String
    }
  ]
})

module.exports = mongoose.model(constants.M_SUBJECT_COLLECTION_NAME, CourseSchema)

