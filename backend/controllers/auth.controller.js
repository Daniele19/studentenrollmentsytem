const User  = require('../models/student.model')
const Token = require("../models/token.model")
const jwt   = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config = require('../config/config')

console.log("JWT New Item: ", expressJwt)

const signin = (req, res) => {
  User.findOne({
    "email": req.body.email
  }, (err, user) => {

    if (err || !user)
      return res.status('401').json({
        error: "User not found."
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }
    //correct password
    const JWT_KEY = config.JWT_KEY;
    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role
      },
      JWT_KEY,
      {
        expiresIn: "1000h"
      }
    )

    const tokenItem = new Token({
      user_id: user._id,
      role   : user.role,
      token  : token
    })
    Token.findOneAndDelete({user_id: user._id}, (err, admin) => {
      // if (err) {
      //     res.json(err);
      // }
    });
    console.log("Arrived until token write");
    tokenItem.save().catch(err => {
      console.log("Error in saving token during login: " + err.message);
    });

    res.cookie("t", token, {
      expire: new Date() + 1000
    })

    return res.json({
      token,
      user: {_id: user._id, name: user.name, firstname: user.firstname, email: user.email, role: user.role, courses: user.courses}
    })

  })
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "Signed out."
  })
}

const requireSignin = expressJwt.expressjwt({
  secret: config.JWT_KEY,
  userProperty: 'auth',
  algorithms: ["HS256"]
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized."
    })
  }
  next()
}

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
