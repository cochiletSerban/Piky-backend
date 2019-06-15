const mongoose = require('mongoose')


const coordinateSchema = new mongoose.Schema({
    lat: {
       type: Number,
       required: true
    },
    lon: {
        type: Number,
        required: true
    }
})
// }, { toObject: {}})


// coordinateSchema.options.toObject.transform = function (doc, ret) {
//     delete ret.__v
//     delete ret._id
//     return ret
// }


// coordinateSchema.methods.toJSON = function () {
//     return this.toObject()
// }


coordinateSchema.virtual('coordinate', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'image'
})


const coordinate = mongoose.model('Coordinate', coordinateSchema)
module.exports = coordinate