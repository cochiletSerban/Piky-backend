const entryRouter = require("express").Router()
const entryControler = require('./entryController')
const auth = require('../../middleware/auth')

entryRouter.post('', auth, entryControler.create)
entryRouter.get('', auth, entryControler.getAll)
entryRouter.get('/:id', auth, entryControler.getById)
entryRouter.delete('', auth, entryControler.deleteEntry)

module.exports = entryRouter