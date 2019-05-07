const User = require('../../../models/user')

let register = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).json("ggwp")
    } catch (e) {
        res.status(400).send(e)
    }
}

let login =  async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).json(token)
    } catch (e) {
        res.status(405).send()
    }
}

module.exports = {
    login:login,
    register:register
}