const userRouter = require("express").Router()
const userController = require('./userController')
const userImageController = require('./userImageController')
const userEntryController = require('./userEntryController')
const authRouter = require('./auth')
const auth = require('../../middleware/auth')

userRouter.use('/auth', authRouter)
userRouter.get('', userController.getAll)
userRouter.patch('/:id', userController.toggleActive)
userRouter.patch('/:id', userController.toggleActive)
userRouter.get('/:id/entries', userEntryController.getAll)
userRouter.get('/images', auth, userImageController.getAll)
module.exports = userRouter