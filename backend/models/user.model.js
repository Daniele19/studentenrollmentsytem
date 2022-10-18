const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  role: { 
    type: String,
    trim: true,
    default: "user", 
    enum: ["user", "root", "teacher"]
  },
  firstname: {
    type: String,
    trim: true,
    required: 'First name is required.'
  },
  lastname: {
    type: String,
    trim: true,
    required: false
  },
  name: {
    type: String,
    trim: true,
    required: 'First name is required.'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists.',
    match: [/.+\@.+\..+/, 'Please use a valid email address.'],
    required: 'Email is required.'
  },
  hashed_password: {
    type: String,
    required: "Password is required."
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  about: {
    type: String,
    trim: true
  },
  profilePicUrl: { type: String },

  coverPicUrl: {type: String},

  newMessagePopup: { type: Boolean, default: true },

  unreadMessage: { type: Boolean, default: false },

  unreadNotification: { type: Boolean, default: false },
  sex: {
    type: String,
  },
  dob: {
    type: Date,
  },
  phone: {
    type: String,
  },
  is_active: {
    type: Boolean,
  },
  resetToken: { type: String },
  expireToken: { type: Date },
},
{ timestamps: true }
);

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
  })
  .get(function() {
    return this._password
  })

UserSchema.pre('save', function callback(next) {
  if (this.hashed_password) {
    this.salt            = bcrypt.genSaltSync(constants.GEN_SALT);
    this.hashed_password = bcrypt.hashSync(this.hashed_password, this.salt);
  }
  next();
});

UserSchema.path('hashed_password').validate(
  function(v) {
    if (this._password && this._password.length < 6) {
      this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
      this.invalidate('password', 'Password is required.')
    }
  }, 
null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password)
  },
}

module.exports = UserSchema;
