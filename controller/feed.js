const User = require('../schema/user')
const Feed = require('../schema/feed')
const Follower = require('../schema/follower')
const { apiResponse } = require('../utility/apiResponse')

const {
  deleteFile,
} = require('../utility/helperFunction')


  //Get All Feeds
  exports.getFeeds = async (req, res) => {
    try {
      const page = parseInt(req.params.page)
      const limit = parseInt(req.params.limit)
  
      const Feeds = await Feed.find({userId:req.userId})
        .skip(page * limit)
        .limit(limit)
      const count = await User.countDocuments()
  
      const totalPages = Math.ceil(count / limit)
      const currentPage = page + 1
  
      if (!Feeds) {
        return apiResponse.unknown(res, 'Feed not found')
      }
  
      const response = {
        Feeds,
        pagination: {
          totalPages,
          currentPage,
        },
      }
      return apiResponse.success(res, response)
    } catch (error) {
      console.log({ error })
      return apiResponse.fail(res)
    }
  }



  //Update Feed 
  exports.updateFeed = async (req, res) => {
    try {
      if (req.files?.location) {
        await deleteFile(req.feed.post)
      }
      req.body.post = req.files.location
      
      const Feeds = await Feed.updateOne({_id:req.params.feedId},{$set:req.body})
      if(Feeds.modifiedCount>0){
        return apiResponse.success(res, 'Feed update successfull!')
      }else{
        return apiResponse.fail(res,'Something went wrong please try again.')
      }
    } catch (error) {
      console.log({ error })
      return apiResponse.fail(res)
    }
  }

  //Create Feed
  exports.createFeed = async (req, res) => {
     try{
          const{user_id,
              caption,
              hashtag,
              tag_friend,
          }=req.body

          const hashtags = hashtag.split(',')

          if (!req.files || req.files.length === 0) {
            return apiResponse.success(res, 'Please select at least one image/video to create post')
          }else{
        
            const data={
              user_id:user_id,
              caption:caption,
              hashtag:hashtags,
              tag_friend:tag_friend,
              location:req.body.location,
              lat:req.body.lat,
              long:req.body.long,
              
            }
          
              data.feedPost = []
              req.files.forEach((element) => {
                const media={url:element.location, mediaType : element.mimetype.split('/')[1]}
                data.feedPost.push(media)
              })
              
              await Feed.create(data)
          
              return apiResponse.success(res, 'post created successfully',{user})
          }
        
     } catch (error) {
      console.log({ error })
      return apiResponse.fail(res)
    }
  }

//Delete Feed
exports.deleteFeed = async (req, res) => {
    try {
     
      const update = await Feed.updateOne({_id:req.params.feedId},{$set:{is_delete:true}})
      console.log(update)
      if(update.modifiedCount>0){
        return apiResponse.success(res, 'Feed Deleted successfully!')
      }else{
        return apiResponse.fail(res,'Sonething went wrong please try again.')
      }
     } catch (error) {
      console.log({ error })
      return apiResponse.fail(res)
    }
  }
  