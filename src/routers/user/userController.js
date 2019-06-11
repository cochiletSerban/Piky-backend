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

let uploadAvatar = async (req, res) => {
    try {
        await User.findOneAndUpdate({_id:req.user._id}, {$set:{avatar:req.file.buffer}})
        res.status(201).send()
    } catch (e) {
        res.status(500).send(e)
    }
}

let getUserDetailes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).send(user);
    } catch (error) {
        res.status(404).json("user not found")
    }
}

module.exports = {
  getAll:getAll,
  toggleActive:toggleActive,
  uploadAvatar: uploadAvatar,
  getUserDetailes: getUserDetailes
}