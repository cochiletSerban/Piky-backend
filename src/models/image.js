const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: Buffer,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image