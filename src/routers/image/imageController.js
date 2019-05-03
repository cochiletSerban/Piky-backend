const Image = require('../../models/image')

let upload = async (req,  res) => {
     console.log(req.files);

    req.files.forEach(async image => {
        await new Image({
            description: 'pozaLAsef',
            picture: image.buffer,
            owner: req.user._id
        }).save()
    })
  
    res.status(201).send('gg wp boss')
}

let getAll = async (req, res) => {
    try {
        let base64Images = [];
        const user = req.user
        await user.populate('images').execPopulate()
        user.images.forEach(image => {
            base64Images.push('data:image/png;base64, ' + getBase64formImage(image.picture))
        })
        res.send(base64Images)
    } catch (e) {
        res.status(404).send()
    }
}

let getBase64formImage = function getBase64formImage (image) {
    return image.toString('base64');
}

module.exports = {
    upload: upload, 
    getAll: getAll,
    getBase64formImage:getBase64formImage
}