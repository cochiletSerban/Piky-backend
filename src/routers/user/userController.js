const User = require('../../models/user')

let getAll = async (req, res) => {
    try {
        res.send(await User.find(req.query).exec())
    } catch (e) {
        res.status(500).send()
    }
}

let toggleActive = async (req, res) => {
    try {
        await User.findOneAndUpdate({_id:req.params.id}, {$set:{active:req.body.active}})
        res.status(200).send()
    } catch (error) {
        res.status(404).send(error)
    }
}

module.exports = {
  getAll:getAll,
  toggleActive:toggleActive
}