const AppRouter = require("express").Router()
const userRoutes = require('./user')
const entryRoutes = require('./entry')
const imageRouter = require('./image')
const commentRouter = require('./comment')
const tagRouter = require('./tag')

AppRouter.use("/users", userRoutes)
AppRouter.use("/entries", entryRoutes)
AppRouter.use('/images', imageRouter)
AppRouter.use('/comments', commentRouter)
AppRouter.use('/tags', tagRouter)

module.exports =  AppRouter