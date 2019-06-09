const Image = require('../../models/image')
const User = require('../../models/user')
const ImageRating = require('../../models/imageRating')
const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')


let upload = async (req,  res) => {
    let savedRating;
    req.files.forEach(async image => {
        savedRating = await new ImageRating({}).save()
        await new Image({
            title: req.body.title,
            fileName: image.originalname,
            description: req.body.description,
            picture: image.buffer,
            owner: req.user._id,
            rating: savedRating._id,
            private: Boolean(req.body.private),
            avatar: Boolean(req.body.avatar)
        }).save()


    })
    res.status(201).send()
}

let getAllPublic = async (req, res) => {
    try {
        const allImages = await Image.find({private: false}) // add a query
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
        res.status(200).send()
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

let isUserValid = async(req) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')  
        const decoded = jwt.verify(token, 'secret')
        const user = await User.findOne({ _id: decoded._id })
        
        if (!user) {
            throw new Error('ne-am dus dracu')
        }
        return user._id;
    
    } catch (e) {
        return null;
    }
}

let getImageById = async(req, res, next) => {
    try {
        const image = await Image.findOne({_id: req.params.imageId}) // add a query
            .populate('rating').populate('owner').exec()

        if (!image.private) {
           return res.send(image)
        }

        const userId = await isUserValid(req)

        if(!userId) {
            return next(httpErrors.BadRequest('esti un slaban si nu ai voie'))
        }

        if (image.private && image.owner._id.toString() === userId.toString()) {
            return res.send(image)
        }

        return next(httpErrors.BadRequest('esti un slaban si nu ai voie'))

    } catch (e) {
        res.status(404).json('n-am ce vrei')
    }
}


module.exports = {
    upload: upload,
    getAllPublic: getAllPublic,
    likeImage: likeImage,
    dislikeImage: dislikeImage,
    resetImageRating: resetImageRating,
    getImageById: getImageById,
    isUserValid:isUserValid,
}
