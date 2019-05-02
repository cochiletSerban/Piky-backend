const imageRouter = require("express").Router()
const imageControler = require('./imageController')
const auth = require('../../middleware/auth')
const multerUpload = require('./multerConfig').multerConfig

imageRouter.post('', auth, multerUpload.single('image'), imageControler.upload)
imageRouter.get('', auth, imageControler.getAll)

module.exports = imageRouter