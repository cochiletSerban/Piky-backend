const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        //required: true,
        trim: true
    },
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        //required: true,
        trim: true
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
    private: {
        type: Boolean

    },
}, {
    timestamps: true,
    toObject: {}
})

// this gets called when that ^ is not used
imageSchema.options.toObject.transform = function (doc, ret) {
    delete ret.createdAt
    delete ret.__v
    delete ret.id
    delete ret.owner.password
    ret.picture = ret.picture.toString('base64');
    ret.picture = 'data:image/png;base64,' + ret.picture
    return ret
}


imageSchema.methods.toJSON = function () {
    return this.toObject()
}




const Image = mongoose.model('Image', imageSchema)

module.exports = Image