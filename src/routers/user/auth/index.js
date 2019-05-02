const authController = require('./authController')
const AuthRouter = require("express").Router()

AuthRouter.post('/login', authController.login)
AuthRouter.post('/register', authController.register)

module.exports = AuthRouter