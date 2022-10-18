const mongoose = require("mongoose");
const configs  = require('./config/config');

async function connectDb() {
  try {
    await mongoose.connect(configs.MONGO_URI + "/" + constants.MONGO_DB_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB database connection established successfully to ", constants.MONGO_DB_NAME );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDb;
