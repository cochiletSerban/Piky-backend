const tagsRouter = require("express").Router()
const tagsController = require("./tagsController")

tagsRouter.get('', tagsController.getAllTags)

module.exports = tagsRouter