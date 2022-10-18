const mongoose = require("mongoose");
const constants = require("../utils/constants")
const Schema = mongoose.Schema; //creates Schema

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
  chats: [
    {
      textsWith: { type: Schema.Types.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
      texts: [
        {
          text: { type: String, required: true },
          sender: { type: Schema.Types.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
          receiver: { type: Schema.Types.ObjectId, ref: constants.M_STUDENT_COLLECTION_NAME },
          date: { type: Date },
        },
      ],
    },
  ],
});

module.exports = mongoose.model(constants.M_CHAT_COLLECTION_NAME, ChatSchema);
