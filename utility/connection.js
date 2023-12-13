const mongoose = require('mongoose')
const secrets = require('./config')
mongoose.set('strictQuery', false)
mongoose
  .connect(secrets.DB_URL)
  .then(() => {
    console.log('Connected to db')
  })
  .catch((err) => {
    console.log('Connection Failed', err.message)
  })
