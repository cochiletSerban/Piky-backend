const Image = require('../../models/image')
const ImageComment = require('../../models/imageComment')

let postComment = async(req, res) => {
    try {
        const comm = await new ImageComment({
            owner: req.user._id,
            text: req.body.text
        }).save()

       const image= await Image.findOneAndUpdate({_id: req.body.imageId}, {$push:{comms:comm._id}})
       comms = await ImageComment.where('_id').in(image.comms)
        .limit(parseInt(0)).sort({'createdAt': 'desc'}).populate('owner').exec()

       res.status(201).send(comms[0])

    } catch (e) {
        res.status(400).json('gura mica, ca nu ai voie')
    }
}

let getCommentsByPictureId = async(req, res) => {
    const image = await Image.findOne({_id: req.params.imageId})
    comms = await ImageComment.where('_id').in(image.comms)
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .populate('owner')
        .sort({'createdAt': 'desc'})
        .exec()
    res.send(comms)
}

module.exports = {
    postComment: postComment,
    getCommentsByPictureId: getCommentsByPictureId
}