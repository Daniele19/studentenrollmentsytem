const mongoose = require("mongoose");
const constants = require("../utils/constants");
const UserSchema = require("./user.model");

const schema = UserSchema.add({
});

const adminSchema = mongoose.model(constants.M_ADMIN_COLLECTION_NAME, schema);
module.exports = adminSchema;
