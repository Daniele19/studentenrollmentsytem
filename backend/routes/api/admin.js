const express    = require('express')
const adminCtrl  = require('../../controllers/admin.controller')
const userCtrl  = require('../../controllers/user.controller')

const router = express.Router()

router.route('/signin')
  .post(adminCtrl.signin)
router.route('/signout')
  .get(adminCtrl.signout)

router.route('/')
  .get(adminCtrl.list)
  .post(adminCtrl.create)

router.route('/photo/:adminId')
  .get(adminCtrl.photo, adminCtrl.defaultPhoto)
router.route('/defaultphoto')
  .get(adminCtrl.defaultPhoto)

router.route('/find')
  .post(adminCtrl.find)

router.route('/enroll')
.put(adminCtrl.requireSignin, userCtrl.addCourse, userCtrl.addStudent) 

router.route('/:adminId')
  .get(adminCtrl.requireSignin, adminCtrl.read)
  .put(adminCtrl.requireSignin, adminCtrl.hasAuthorization, adminCtrl.update)
  .delete(adminCtrl.requireSignin, adminCtrl.hasAuthorization, adminCtrl.remove)

router.param('adminId', adminCtrl.adminByID)
router.param('userId', userCtrl.userByID)

module.exports = router

