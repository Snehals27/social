const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const User = require('../schema/user')
const secrets = require('./config')
const { apiResponse } = require('./apiResponse')

const loggedInUser = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return apiResponse.unknown(res, 'Token is required!')
  }
  const accessToken = token.split(' ')[1]
  jwt.verify(
    accessToken,
    secrets.JWT_TOKEN_SECRET,
    async function (err, tokenData) {
      if (err?.message === 'jwt expired') {
        console.log(err.message)
        return apiResponse.unauthorized(
          res,
          'Token expired! please login again'
        )
      }
      if (err) {
        console.log(err)
        return apiResponse.unauthorized(res, 'access denied!')
      }
      const user = await User.findById({
        _id: tokenData.id,
      })

      if (!user) {
        return apiResponse.unauthorized(res, 'Access denied')
      }
      req.user = user
      req.userId = user._id
      next()
    }
  )
}

module.exports = {
  loggedInUser: loggedInUser,
}
