const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const secrets = require('../utility/config')
aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: secrets.SECRET_ACCESS_KEY,
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: secrets.ACCESS_KEY_ID,
  region: 'us-east-1', // region of your bucket
})
const s3 = new aws.S3()
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'social',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
      })
    },
    key: function (req, file, cb) {
      const extArray = file.originalname.split('.')
      const extension = extArray[extArray.length - 1]
      cb(null, 'profile/' + Date.now().toString() + '.' + extension)
    },
  }),
  fileFilter: function (req, file, cb) {
    console.log({ file })
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      return cb(null, true)
    }
    cb(new Error('Only ["png","jpg", "jpeg"] files are allowed.'))
  },
})



exports.uploadMedia = function (req, res, next) {
  upload.single('media')(req, res, function (err, some) {
    if (err) {
      console.log(err)
      return res.status(422).send({
        errors: [
          {
            title: 'Image Upload Error',
            detail: err.message,
          },
        ],
      })
    }
    console.log(some)
    console.log({ location: req.file?.location })
    next()
  })
}
//to upload multiple images
const uploadMultiple = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'social',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // acl: 'public-read',
    metadata: function (req, files, cb) {
      cb(null, {
        fieldName: files.fieldname,
      })
    },
    key: function (req, files, cb) {
      const extArray = files.originalname.split('.')
      const extension = extArray[extArray.length - 1]
      cb(null, 'feed/' + Date.now().toString() + '.' + extension)
    },
  }),
  fileFilter: function (req, files, cb) {
    console.log({ files })
    if (
      files.mimetype === 'image/png' ||
      files.mimetype === 'image/jpg' ||
      files.mimetype === 'image/jpeg'
    ) {
      return cb(null, true)
    }
    cb(new Error('Only ["png","jpg", "jpeg"] files are allowed.'))
  },
})

exports.uploadMultipleMedia = function (req, res, next) {
  uploadMultiple.array('media', 10)(req, res, function (err, some) {
    if (err) {
      console.log(err)
      return res.status(422).send({
        errors: [
          {
            title: 'File Upload Error',
            detail: err.message,
          },
        ],
      })
    }
    console.log(some)
    console.log({ location: req.files?.location })
    next()
  })
}



exports.s3bucket = s3
