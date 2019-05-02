const Image = require('../../models/image')

let upload = async (req,  res) => {
     console.log(req.file);
    const image = new Image({
        description: 'pozaLAsef',
        picture: req.file.buffer,
        owner: req.user._id
    })

    await image.save()
    res.status(201).send('gg wp boss')
}

let getAll = async (req, res) => {
    try {
        const user = req.user
        await user.populate('images').execPopulate()
        const bufferImage = user.images[1].picture
        res.send(bufferImage)
        

    } catch (e) {
        res.status(404).send()
    }
}

module.exports = {
    upload: upload, 
    getAll: getAll
}