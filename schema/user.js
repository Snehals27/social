const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, minLength: 6 },
    full_name: { type: String },
    user_name: { type: String },
    //birth_date: { type: Date },
    phone_no: { type: Number },
    //occupation: { type: String }, 
    token: { type: String },
    is_deleted: { type: Boolean, default: false },
 },
  {
    timestamps: true,
  }
)
const User = new mongoose.model('User', userSchema)
module.exports = User
