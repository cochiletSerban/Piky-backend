const jwt = require('jsonwebtoken')
const User = require('../models/user')
var httpErrors = require('http-errors')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'secret')
        const user = await User.findOne({ _id: decoded._id })

        if (!user) {
            throw new Error('sadfsadfsdfdsfdsfdsfdsfds')
        }
        req.user = user
        next()
    } catch (e) {
        //let err = httpErrors.NotFound('The thing you were looking for was not found');
        //console.log(httpErrors(401, 'Please login to view this page.'))
        
         return next(httpErrors.NotFound())
    }
}

module.exports = auth