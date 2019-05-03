const imageRouter = require("express").Router()
const imageControler = require('./imageController')
const auth = require('../../middleware/auth')
const multerUpload = require('./multerConfig').multerConfig

imageRouter.post('', auth, multerUpload.array('image', 100), imageControler.upload)
imageRouter.get('', auth, imageControler.getAllPublic)

module.exports = imageRouter