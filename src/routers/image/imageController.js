const Image = require('../../models/image')
const User = require('../../models/user')

const ImageRating = require('../../models/imageRating')
const ImageComment = require('../../models/imageComment')
const Coordinate = require('../../models/coordinate')
const jwt = require('jsonwebtoken')
const httpErrors = require('http-errors')
const sharp = require('sharp');
const geolib = require('geolib');


let upload = async (req,  res) => {
    let savedRating;
    let coordinate;
    for (image of req.files) {
        savedRating = await new ImageRating({}).save()
        if (Boolean(req.body.avatar) === false) {
            coordinate = await new Coordinate({
                lat: req.body.lat,
                lon: req.body.lon,
            }).save()
        }
        await new Image({
            title: req.body.title,
            fileName: image.originalname,
            description: req.body.description,
            picture: image.buffer,
            owner: req.user._id,
            rating: savedRating._id,
            coordinate: coordinate._id,
            tags: req.body.tags !== undefined ? JSON.parse(req.body.tags) : undefined,
            private: req.body.private,
            avatar: req.body.avatar
        }).save()
    }
    res.status(201).send()
}

let smallUpload = async (req, res) => {
    try {
        let savedRating;
        let coordinate;
        for (image of req.files) {
            savedRating = await new ImageRating({}).save()
            if (Boolean(req.body.avatar) === false) {
                coordinate = await new Coordinate({
                    lat: req.body.lat,
                    lon: req.body.lon,
                }).save()
            }
            const img = await sharp(image.buffer).resize({ width: 269 }).toBuffer() // maybe 500px
            await new Image({
                title: req.body.title,
                fileName: image.originalname,
                description: req.body.description,
                picture: img,
                owner: req.user._id,
                coordinate: coordinate._id,
                rating: savedRating._id,
                tags: req.body.tags !== undefined ? JSON.parse(req.body.tags) : undefined,
                private: req.body.private,
                avatar: req.body.avatar
            }).save()
        }
        res.status(201).send()
    } catch(e) {
        console.log(e);
        res.status(500).send()
    }
}

let getImages = async (req, res) => {
    try {
        let sortBy = {};
        if (req.query.sort) {
            sortBy[req.query.sort[0]] = 'desc'
            sortBy.createdAt = req.query.sort[1]
        } else {
           sortBy = {'createdAt': 'desc'}
        }

        if (req.query.lat && req.query.lon && req.query.radius) {
            res.status(200).send(await getImageInRadius(
                    req.query.radius,
                    {
                        lat: req.query.lat,
                        lon: req.query.lon
                    },
                    parseInt(req.query.limit),
                    parseInt(req.query.skip),
                    req.query.comments
                )
            )

        } else {
            let query = {};
            if (req.query.tag) {
                query.tags = req.query.tag
            }
            const allImages = await Image.find(query).where('private').equals(false) // add a query
                .limit(parseInt(req.query.limit))
                .skip(parseInt(req.query.skip))
                .populate('rating')
                .sort(sortBy)
                .populate('coordonates')
                .populate('owner').exec()
            res.send(allImages)
        }
    } catch (e) {
        console.log(e)
        res.status(404).send()
    }
}

/*
makeResponsePretty(resp , objField) {
    const set = new Set();
    return resp.map((v, index) => {
        if (set.has(v[objField])) {
            return false;
        } else {
            set.add(v[objField]);
            return index;
        }
      }).filter(e => e)
        .map(e => {
          const obj = {};
          obj[objField] = resp[e][objField];
          return  obj;
        });
  }

*/

//where geolib.getDistance(UserCoordinates, {DbLat,DbLen} <= radius)
let getImageInRadius = async (radius, userCoordinates, limit, skip, comments = false) => {
    let imageComments = []

    const allCoordinates = await Coordinate.find({}).lean()
    let coordinatesInRadius = []

    allCoordinates.forEach(coordinate => {
        if (geolib.getDistance(userCoordinates, coordinate) <= radius) {
            coordinatesInRadius.push(coordinate._id);
        }
    })

    const images = await Image.where('private').equals(false).where('coordinate')
        .in(coordinatesInRadius).limit(limit).skip(skip)
        .populate('owner')
        .populate('rating').exec()

        if (comments) {

            for (const image of images) {
                if (image.numberOfComments === 0) {
                    continue;
                }
                let comms = await ImageComment.where('_id').in(image.comms)
                .limit(3)
                .skip(0)
                .populate('owner')
                .sort({'createdAt': 'desc'})
                .exec()
                comms = comms.map(comm => {
                    return  {
                        ...comm.toJSON(),
                        imageId: image._id
                    }
                })
                imageComments.push(...comms)
            }
            return imageComments
        }
    return images
    
}

let likeImage = async(req, res) => {
    try {
        const imageToLike = await Image.findById(req.params.imageId)
        const ratingId = imageToLike.rating;
        const dislikes = await ImageRating.findOneAndUpdate({_id: ratingId}, {$pull: {dislikes: req.user._id}}, {new: true})
        const likes = await ImageRating.findOneAndUpdate({_id: ratingId}, {$addToSet: {likes: req.user._id}}, {new: true})
        await Image.updateOne({_id:imageToLike._id}, {ratingScore: likes.likes.length - dislikes.dislikes.length})
        res.status(200).send()
    } catch (e) {
        console.log(e);
        res.status(505).send()
    }
}

let dislikeImage = async(req, res) => {

    try {
        const imageToLike = await Image.findById(req.params.imageId)
        const ratingId = imageToLike.rating;
        const likes = await ImageRating.findOneAndUpdate({_id: ratingId}, {$pull: {likes: req.user._id}}, {new: true})
        const dislikes = await ImageRating.findOneAndUpdate({_id: ratingId}, {$addToSet: {dislikes: req.user._id}}, {new: true})
        await Image.updateOne({_id: imageToLike._id}, {ratingScore: likes.likes.length - dislikes.dislikes.length})
        res.status(200).send()

    } catch (e) {
        console.log(e);
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
            .populate('rating').populate('owner').populate('coordonate').exec()

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
    getImages: getImages,
    likeImage: likeImage,
    dislikeImage: dislikeImage,
    resetImageRating: resetImageRating,
    getImageById: getImageById,
    isUserValid:isUserValid,
    smallUpload: smallUpload,
    getImageInRadius:getImageInRadius
}
