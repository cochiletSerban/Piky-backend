const Image = require('../../models/image')

let getAll = async (req, res) => {
    try {
        const user = req.user
        await user.populate({
            path:'images',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {'createdAt': 'desc'}
            },
            match: {
                private: req.query.private === undefined ? false : req.query.private
            }
        }).execPopulate()
        res.send(user.images)
    } catch (e) {
        res.status(404).send()
    }
}

module.exports = {
    getAll: getAll,
}
