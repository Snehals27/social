const express = require('express')
const router = express.Router()

router.use('/user', require('./user'))
router.use('/feed', require('./feed'))

module.exports = router
