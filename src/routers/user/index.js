const userRouter = require("express").Router()
const userController = require('./userController')
const userEntryController = require('./userEntryController')
const authRouter = require('./auth')

userRouter.use('/auth', authRouter)
userRouter.get('', userController.getAll)
userRouter.patch('/:id', userController.toggleActive)
userRouter.patch('/:id', userController.toggleActive)
userRouter.get('/:id/entries', userEntryController.getAll)

module.exports = userRouter