const express = require('express')
const feedController = require('../controller/feed')
const { Joi, celebrate } = require('celebrate')
const { uploadMultipleMedia } = require('../statics/s3service')
const auth = require('../utility/userAuth')
const router = express.Router()


router.post(
  '/createFeed',
  celebrate({
    body: Joi.object().keys({
      user_id: Joi.string(),
      post: Joi.any(),
      caption:Joi.string(),
      hashtag:Joi.string()
    }),
  }),
  uploadMultipleMedia,
  auth.loggedInUser,
  feedController.createFeed,
)

router.get(
  '/getFeeds/:page/:limit',
      auth.loggedInUser,
      feedController.getFeeds
)
router.put(
  '/updateFeed/:feedId',

    uploadMultipleMedia,
    auth.loggedInUser,
    feedController.updateFeed
)
router.post(
  '/deleteFeed/:feedId', 
    auth.loggedInUser,
    feedController.deleteFeed
)

module.exports = router