const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require("bcryptjs")
const constants = require("../utils/constants")
const GenSchema = require("./user.model")
var Schema = mongoose.Schema;

const UserSchema = GenSchema.add({
  level: {
    type: String,
    trim: true,
    required: 'Level is required.'
  },
  courses: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Course model
      ref: constants.M_STUDENT_COLLECTION_NAME
    }
  ],
  following: 
    [
      {type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME}
    ],
  followers: 
    [
      {type: mongoose.Schema.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME}
    ]
},
{ timestamps: true })


var User =  mongoose.model(constants.M_STUDENT_COLLECTION_NAME, UserSchema);

// Export the User model
module.exports = User;

