const AppRouter = require("express").Router()
const userRoutes = require('./user')
const entryRoutes = require('./entry')
const imageRouter = require('./image')

AppRouter.use("/users", userRoutes)
AppRouter.use("/entries", entryRoutes)
AppRouter.use('/images', imageRouter)

module.exports =  AppRouter