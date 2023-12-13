const express = require('express')
const userController = require('../controller/user')
const { Joi, celebrate } = require('celebrate')
const auth = require('../utility/userAuth')
const router = express.Router()

router.post(
  '/register',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string(),
      password: Joi.string(),
      full_name: Joi.string(),
      phone_no: Joi.number(),
    }),
  }),
  userController.register
)

router.post(
  '/login',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string(),
      password: Joi.string(),
    }),
  }),
  userController.login
)

router.post('/logout', auth.loggedInUser, userController.logout)

router.post(
  '/sendFollowReq',
  celebrate({
    body: Joi.object().keys({
      followerList: Joi.array(),
    }),
  }),
  auth.loggedInUser,
  userController.sendFollowReq
)
router.get(
  '/getFollowRequest',
  auth.loggedInUser,
  userController.getFollowRequest
)

router.post(
  '/followReqResponse',
  celebrate({
    body: Joi.object().keys({
      status: Joi.string(),
      follower_id: Joi.string(),
    }),
  }),

  auth.loggedInUser,
  userController.followReqResponse
)



module.exports = router
