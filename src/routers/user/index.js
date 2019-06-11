const userRouter = require("express").Router()
const userController = require('./userController')
const userImageController = require('./userImageController')
const userEntryController = require('./userEntryController')
const authRouter = require('./auth')
const auth = require('../../middleware/auth')
const multerUpload = require('../image/multerConfig').multerConfig

userRouter.use('/auth', authRouter)
userRouter.get('', auth, userController.getUserDetailes)
userRouter.patch('/:id', userController.toggleActive)
userRouter.patch('/:id', userController.toggleActive)
userRouter.get('/:id/entries', userEntryController.getAll)
userRouter.get('/images', auth, userImageController.getAll)
userRouter.post('/avatar', auth, multerUpload.single('image'), userController.uploadAvatar)
module.exports = userRouter