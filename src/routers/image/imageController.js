const Image = require('../../models/image')
const ImageRating = require('../../models/imageRating')

let upload = async (req,  res) => {
    console.log('saddfdsdfsd');
    
    let savedRating;
    req.files.forEach(async image => {

        savedRating = await new ImageRating({}).save()

        await new Image({
            title: req.body.title,
            fileName: image.originalname,
            description: req.body.description,
            picture: image.buffer,
            owner: req.user._id,
            rating: savedRating._id
        }).save()


    })
    res.status(201).send('gg wp boss')
}

let getAllPublic = async (req, res) => {
    try {
        const allImages = await Image.find({}) // add a query
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .populate('rating').populate('owner').exec()
        res.send(allImages)
    } catch (e) {
        res.status(404).send()
    }
}

let likeImage = async(req, res) => {
    try {
        // also remove users dislike
        const imageToLike = await Image.findById(req.body.imageId)
        const ratingId = imageToLike.rating;
        await ImageRating.findOneAndUpdate({_id: ratingId}, {$pull:{dislikes:req.user._id}})
        await ImageRating.findOneAndUpdate({_id: ratingId}, {$addToSet:{likes:req.user._id}})
        res.status(200).send('ggwp')
    } catch (e) {
        res.status(505).send()
    }
}

let dislikeImage = async(req, res) => {

    try {
        const imageToLike = await Image.findById(req.body.imageId)
        const ratingId = imageToLike.rating;
        await ImageRating.findOneAndUpdate({_id: ratingId}, {$pull:{likes:req.user._id}})
        await ImageRating.findOneAndUpdate({_id: ratingId}, {$addToSet:{dislikes:req.user._id}})
        res.status(200).send()

    } catch (e) {
        res.status(505).send()
    }
}


let resetImageRating = async(req, res) => {
    try {
        const imageToLike = await Image.findById(req.body.imageId)
        const ratingId = imageToLike.rating;
        await ImageRating.findOneAndUpdate({_id: ratingId}, {$pull:{likes:req.user._id}})
        await ImageRating.findOneAndUpdate({_id: ratingId}, {$pull:{dislikes:req.user._id}})

        res.status(200).send()
    } catch (e) {
        res.status(505).send()
    }
}

module.exports = {
    upload: upload,
    getAllPublic: getAllPublic,
    likeImage: likeImage,
    dislikeImage: dislikeImage,
    resetImageRating: resetImageRating
}
