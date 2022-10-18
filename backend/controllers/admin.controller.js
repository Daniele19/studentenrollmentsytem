const Admin      = require('../models/admin.model')
const User       = require('../models/user.model')
const Token      = require("../models/token.model")
const jwt        = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config     = require('../config/config')
const contants   = require('../utils/constants')
const _          = require('lodash')
const errorHandler = require('../utils/dbErrorHandler')
const formidable   = require('formidable')
const fs           = require('fs')

const signin = (req, res) => {
  Admin.findOne({
    "email": req.body.email
  }, (err, user) => {

    if (err || !user)
      return res.status('401').json({
        error: "Admin not found."
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
    Token.findOneAndDelete({Admin_id: user._id}, (err, admin) => {
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
      Admin: {_id: user._id, name: user.name, firstname: user.firstname, email: user.email, role: user.role, courses: user.courses}
    })

  })
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "Signed out."
  })
}

/**
 * Load admin and append to req.
 */
const adminByID = (req, res, next, id) => {
  Admin.findById(id)
    .exec((err, user) => {
    if (err || !user) return res.status('400').json({
      error: "Admin not found."
    })
    req.profile = user
    next()
  })
}

const photo = (req, res, next) => {
  if(req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+'/client/public/assets/images/avatars/avatar6.png')
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt            = undefined
  return res.json(req.profile);
}

const create = async (req, res, next) => {
  req.body.role = constants.USER_TYPE_ADMIN
  const admin   = new Admin(req.body)
  // check if user already exist
  // Validate if user exist in our database
  //const oldAdmin = await Admin.findOne({ admin.email });

  if (oldAdmin) {
    return res.status(409).send("Admin Already Exist. Please Login");
  }

  admin.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(201).json({
      message: "admin added",
      admin:  result
    })
  })
}

const list = (req, res) => {
  Admin.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).select('name email phone updated created following')
}

const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded."
      })
    }
    let user = req.profile
    user = _.extend(user, fields)
    user.updated = Date.now()
    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    })
  })
  /*Token
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      Admin
        .update({ _id: req.params.id }, req.body)
        .then((result) => {
          res.status(200).json({
            message: "Admin Updated successfully",
            createdParent: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Updating failed",
            error: err,
          });
        });
    });*/
}

const remove = (req, res) => {
  Token
    .find({ token: req.token })
    .exec()
    .then((resultList) => {
      if (resultList.length < 1) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }
      Admin.findOneAndDelete({ _id: req.params.id }, (err, admin) => {
        if (err) {
          res.json(err);
        } else {
          Token.findOneAndDelete(
            { user_id: req.params.id },
            (err, admin) => {
              if (err) {
                res.json(err);
              } else {
                res.json("deleted successfully");
              }
            }
          );
        }
      });
    });
}

const find = (req,res) => {
  var name = req.body.name;
  var query = {};
  query[name] = { $regex: req.body.value };
  Admin
    .find(query)
    .exec()
    .then((resultList) => {
      if (resultList) {
        res.json(resultList);
      }
    });
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
      error: "Admin is not authorized."
    })
  }
  next()
}

module.exports = {
  signin,
  signout,
  read,
  requireSignin,
  create,
  remove,
  update,
  find,
  list,
  adminByID,
  photo,
  defaultPhoto,
  hasAuthorization
}
