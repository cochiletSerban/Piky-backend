const mongoose = require('mongoose')


const imageRatingSchema = new mongoose.Schema({
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },

})

imageRatingSchema.virtual('rating', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'image'
})

const ImageRating = mongoose.model('ImageRating', imageRatingSchema)
module.exports = ImageRating