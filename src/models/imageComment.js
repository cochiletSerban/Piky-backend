const mongoose = require('mongoose')


const imageCommentSchema = new mongoose.Schema({
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
    toObject: {}
})

imageCommentSchema.virtual('comment', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'image'
})


imageCommentSchema.options.toObject.transform = function (doc, ret) {
    delete ret.createdAt
    delete ret.__v
    delete ret._id //
    delete ret.likes //
    delete ret.dislikes  //
    delete ret.owner.password
    delete ret.owner.email
    return ret
}


imageCommentSchema.methods.toJSON = function () {
    return this.toObject()
}

const ImageComment = mongoose.model('ImageComment', imageCommentSchema)
module.exports = ImageComment