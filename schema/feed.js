const mongoose = require('mongoose')
const feedSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId,
              ref: 'User', },
    feedPost: [{url:{type:String},
           mediaType: {type:String,enum:['jpg','jpeg','png','mp4']}}],
    caption:{ type: String },
    like_count:{ type: Number },
    like:[{type: mongoose.Schema.Types.ObjectId,ref: 'User',}],
    comment_count:{ type: Number },
    comment_id:{type: String},
    location:{type: String},
    lat:{type:Number},
    long:{type:Number},
    is_delete:{type:Boolean},
    
  },
  {
    timestamps: true,
  }
)

const Feed = new mongoose.model('Feed', feedSchema)

module.exports = Feed
