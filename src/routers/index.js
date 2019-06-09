const AppRouter = require("express").Router()
const userRoutes = require('./user')
const entryRoutes = require('./entry')
const imageRouter = require('./image')
const commentRouter = require('./comment')

AppRouter.use("/users", userRoutes)
AppRouter.use("/entries", entryRoutes)
AppRouter.use('/images', imageRouter)
AppRouter.use('/comments', commentRouter)

module.exports =  AppRouter