const Taks = require('../../models/entry')

let createEntry =  async (req, res) => {
    const task = new Taks({
        ...req.body,
        owner: req.user._id
    })
    try {
        const savedTask  = await task.save()
        res.send(savedTask)
    } catch (error) {
        res.send(error).status(500)
    }
}

module.exports = {
    createEntry : createEntry
}