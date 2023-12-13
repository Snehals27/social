// const mongoose = require('mongoose')
require('dotenv').config()
const express = require('express')
const { isCelebrateError } = require('celebrate')
const morgan = require('morgan')

require('./utility/connection')
const Router = require('./routes/index')
const secrets = require('./utility/config')


const app = express()
app.use(morgan('dev'))

app.use(express.static('public'))
app.use(
  express.json({
    limit: '50mb',
  })
)

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  })
)

app.use('/api', Router)


// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode
//   const message = 'Route Not Found!'
//   res.status(404)
//   res.json({
//     message: message,
//     statusCode: statusCode,
//     success: false,
//   })
// })


app.listen(secrets.PORT, () => {
  console.log('Connection is Set : ', secrets.PORT)
})
