
const User = require('../schema/user')
const Follower = require('../schema/follower')
const { apiResponse } = require('../utility/apiResponse')
const secrets = require('../utility/config')
const {
  isValidEmail,
  isValidPassword,
  createJWTToken
} = require('../utility/helperFunction')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      phone_no
      
    } = req.body
    //console.log(req.body)
    let newUser

    if (!isValidEmail(email)) {
      return apiResponse.unknown(res, 'Invalid email')
    }
    const user = await User.findOne({ email })
    if (user?.is_deleted) {
      return apiResponse.unknown(
        res,
        'account related to this email id is already deleted'
      )
    }
    if (user) {
      return apiResponse.unknown(res, 'Email already in use')
    }
    if (password.length < 8) {
      return apiResponse.unknown(res, 'Password too short')
    }
    if (!isValidPassword(password)) {
      //deleteFile(req.file.location)
      return apiResponse.unknown(
        res,
        'password must have at least one letter, one number and one special character'
      )
    }
    const passwordHash = await bcrypt.hash(password, 12)
    console.log({ body: req.body })
    if (
      !email ||
      !user_name ||
      !full_name ||
      !phone_no 
    ) {
    
      return apiResponse.unknown(res, 'all fields are required')
    }
      newUser = await User.create({
        email: email,
        user_name: user_name,
        phone_no: phone_no,
        full_name: full_name,
        password: passwordHash,
      })
    
    console.log({ newUser })
    return apiResponse.success(res, 'user crated successfully')
  } catch (error) {
    console.log({ error })
    return apiResponse.fail(res)
  }
}

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({
      email,
    })
    if (!user) {
      return apiResponse.unknown(res, 'User not found')
    }
    if (user.is_deleted) {
      return apiResponse.unauthorized(req, 'this user is already deleted')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return apiResponse.unknown(res, 'Invalid email or password')
    }
    const token = createJWTToken({
      id: user._id,
    })
    user.token = `Bearer ${token}`
    await user.save()
    return apiResponse.success(res, 'successfully logged in', {
      token: `Bearer ${token}`,
    })
  } catch (error) {
    console.log({ error })
    return apiResponse.fail(res)
  }
}

exports.logout = async (req, res) => {
  try {
    req.user.token = ''
    await req.user.save()
    return apiResponse.success(res, 'logout successful')
  } catch (error) {
    console.log({ error })
    return apiResponse.fail(res)
  }
}

//Send User Folllow request
exports.sendFollowReq = async (req, res) => {
  try {
      const {
        followerList,
      } = req.body
      const userId= req.userId
      
        followerList.forEach(async (element) => {
            
              const isuserFollower = await Follower.findOne({ user_id : userId, follower_id : element })
              if (!isuserFollower) {
                    await Follower.create({
                          user_id: userId,
                          follower_id: element,
                          status:'Pending'
                      })
                      
              }
          })
        return apiResponse.success(res,' Follow Request Succuess')
      
  }catch (error) {
    console.log({error})
    return apiResponse.fail(res)    
  }
}

exports.getFollowRequest = async (req, res) => {
  try{
     
      const follower = await Follower.find({user_id:req.userId,status:'Pending'}).select({'follower_id':1})
      //console.log(follower)
      if (!follower) {
        return apiResponse.unknown(res, 'user not found')
      }else{
         const followerIds = follower.map(item => item.follower_id)
         const user = await User.find({_id: { $in: followerIds }}).select({'full_name':1, 'avtar':1,'occupation':1 })
         //console.log(user)
         return apiResponse.success(res,user)
    }
      
  }catch (error) {
    console.log({error})
    return apiResponse.fail(res)    
  }
}


//User Follow Accept & Unfollow 
exports.followReqResponse = async (req, res) => {
  try{
    const {
      follower_id,
      status
    } = req.body
    let userFollow
    let userFollower
    let userFollowing
      if(status=='Accepted'){
          userFollow = await Follower.updateOne({user_id:req.userId,follower_id:follower_id},{$set:{status:'Accepted'}})
          userFollower = await User.updateOne({_id:req.userId},{ $inc: { followers_count:  1 }})
          userFollowing = await User.updateOne({_id:follower_id},{ $inc: { following_count:  1 }})
      }else{
          userFollow = await Follower.updateOne({user_id:req.userId,follower_id:follower_id},{$set:{status:'Follow'}})
          userFollower = await User.updateOne({_id:req.userId},{ $inc: { followers_count:  -1 }})
          userFollowing = await User.updateOne({_id:follower_id},{ $inc: { following_count:  -1 }})

      }
    if(userFollow.modifiedCount>0 && userFollower.modifiedCount>0 && userFollowing.modifiedCount>0 ){
      return apiResponse.success(res, 'Request Accepted/Unfollowed!')
    }else{
      return apiResponse.fail(res,'Sonething went wrong please try again.')
    }

  }catch (error) {
    console.log({error})
    return apiResponse.fail(res)
  }
}



