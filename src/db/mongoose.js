const mongoose = require('mongoose')

let connectToDb = (url) => {
    mongoose.set('useFindAndModify', false);
    //mongoose.set('toJSON', { virtuals: true });
    //mongoose.set('toObject', { virtuals: true });
    mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true})
}

module.exports = {
    connectToDb: connectToDb
}