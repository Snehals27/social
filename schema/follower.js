const mongoose = require('mongoose')
const userFollowerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId,
      ref: 'User', },
    follower_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status:{type: String ,enum:['Accpted','Pending','Follow'],default: 'Pending'}
  },
  {
    timestamps: true,
  }
)

const UserFollower = new mongoose.model('UserFollower', userFollowerSchema)

module.exports = UserFollower
