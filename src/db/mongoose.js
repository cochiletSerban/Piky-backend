const mongoose = require('mongoose')

let connectToDb = (url) => {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true})
}

module.exports = {
    connectToDb: connectToDb
}