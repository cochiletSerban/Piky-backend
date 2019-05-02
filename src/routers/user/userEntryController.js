// /user/id/tasks?
const Entry = require('../../models/entry')

let getAll = async (req, res) => {
    try {
        res.send(await Entry.find({owner: req.params.id, ...req.query}))
    } catch (e) {
        res.status(404).send()
    }
}

module.exports = {
    getAll:getAll
}