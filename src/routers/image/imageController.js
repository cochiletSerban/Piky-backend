const Image = require('../../models/image')

let upload = async (req,  res) => {
     console.log(req.body.yolo);

    req.files.forEach(async image => {
        await new Image({
            title: req.body.title,
            fileName: image.originalname,
            description: req.body.description,
            picture: image.buffer,
            owner: req.user._id
        }).save()
    })
    res.status(201).send('gg wp boss')
}

let getAllPublic = async (req, res) => {
    try {
        const userImages = await Image.find({}) // add a query
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .populate('owner',).exec()

        res.send(userImages)
    } catch (e) {
        res.status(404).send()
    }
}


module.exports = {
    upload: upload,
    getAllPublic: getAllPublic,
}
