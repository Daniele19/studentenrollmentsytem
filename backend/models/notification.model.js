const mongoose = require("mongoose");
const constants = require("../utils/constants")
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
  notifications: [
    {
      type: { type: String, enum: ["newLike", "newComment", "newFollower"] },
      //the user from whom this notification is
      user: { type: Schema.Types.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
      post: { type: Schema.Types.ObjectId, ref: constants.M_POST_COLLECTION_NAME },
      commentId: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model(constants.M_NOTIFICATION_COLLECTION_NAME, NotificationSchema);
