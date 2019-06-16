const Image = require('../../models/image')

let getAll = async (req, res) => {
    try {
        const user = req.user
        if (req.query.private !== undefined ) {
            await user.populate({
                path:'images',
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort: {'createdAt': 'desc'}
                },
                match: {
                    private: req.query.private,
                    avatar: false
                }
            }).execPopulate()
            res.send(user.images)
        } else {
            await user.populate({
                path:'images',
                match: {
                    avatar: false
                },
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort: {'createdAt': 'desc'}
                }
            }).execPopulate()
            res.send(user.images)
        }
    } catch (e) {
        console.log(e);
        res.status(404).send()
    }
}

module.exports = {
    getAll: getAll,
}
