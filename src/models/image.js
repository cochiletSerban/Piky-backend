const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    tags: {
        type: [String],
        default: 'all'
    },
    picture: {
        type: Buffer,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ImageRating'
    },
    ratingScore: {
        type: Number,
        default: 0
    },
    comms: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ImageComment'
    },
    numberOfComments: {
        type: Number,
        default: 0
    },
    coordinate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coordinate'
    },
    private: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: {}
})





// this gets called when that ^ is not used
imageSchema.options.toObject.transform = function (doc, ret) {
    delete ret.updatedAt
    delete ret.__v
    delete ret.id
    ret.comms = ret.comms.length
    delete ret.owner.password
    delete ret.rating._id
    delete ret.rating.__v
    ret.picture = ret.picture.toString('base64');
    ret.picture = 'data:image/png;base64,' + ret.picture
    delete ret.numberOfComments
    //delete ret.picture
    return ret
}


imageSchema.methods.toJSON = function () {
    return this.toObject()
}


const Image = mongoose.model('Image', imageSchema)

module.exports = Image