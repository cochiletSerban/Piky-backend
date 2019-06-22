const tagsRouter = require("express").Router()
const tagsController = require("./tagsController")

tagsRouter.get('', tagsController.getAllTags)
tagsRouter.get('/:tagName', tagsController.getTagByName)

module.exports = tagsRouter