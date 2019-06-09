const multer = require('multer')

const multerConfig = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

module.exports = {
    multerConfig: multerConfig
}