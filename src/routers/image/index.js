const imageRouter = require("express").Router()
const imageControler = require('./imageController')
const auth = require('../../middleware/auth')
const multerUpload = require('./multerConfig').multerConfig

imageRouter.post('', auth, multerUpload.array('image', 100), imageControler.upload)
imageRouter.get('', imageControler.getAllPublic)
imageRouter.get('/:imageId', imageControler.getImageById),
imageRouter.post('/like', auth, imageControler.likeImage)
imageRouter.post('/dislike', auth, imageControler.dislikeImage)
imageRouter.post('/resetImageRating', auth, imageControler.resetImageRating)

module.exports = imageRouter