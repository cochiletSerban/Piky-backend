const commentRouter = require("express").Router()
const commentControler = require('./commentControler')
const auth = require('../../middleware/auth')

commentRouter.post('', auth, commentControler.postComment)
commentRouter.get('/:imageId', commentControler.getCommentsByPictureId)

module.exports = commentRouter