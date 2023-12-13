
const jwt = require('jsonwebtoken')
const secrets = require('./config')


const createJWTToken = (payload) =>
  jwt.sign(payload, secrets.JWT_TOKEN_SECRET, {
    expiresIn: '7d',
  })

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}

const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return passwordRegex.test(password)
}

const generateRandomString = (length) => {
  const charset = '0123456789'
  let randomString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomString += charset.charAt(randomIndex)
  }
  if (parseInt(randomString) < 1000) {
    randomString = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      randomString += charset.charAt(randomIndex)
    }
  }
  return randomString
}



module.exports = {
  createJWTToken: createJWTToken,
  isValidEmail: isValidEmail,
  isValidPassword: isValidPassword,
  generateRandomString: generateRandomString,
  
}
