const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    private: {
        type:Boolean,
        required:true
    }
}, {
    timestamps:true
})

module.exports = mongoose.model('Entry', entrySchema)