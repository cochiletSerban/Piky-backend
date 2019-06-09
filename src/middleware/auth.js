const jwt = require('jsonwebtoken')
const User = require('../models/user')
const httpErrors = require('http-errors')
const validators = require('../utils/validators/validators')

const auth = async (req, res, next) => {
    try {

        
       if (!validators.isJwtProvided(req.header('Authorization'))) {
           return next(httpErrors.BadRequest('JWT not provided / not provided properly, adica nu ai voie boss'))
       }

       const token = req.header('Authorization').replace('Bearer ', '')
        
       const decoded = jwt.verify(token, 'secret')
       
       const user = await User.findOne({ _id: decoded._id })
       if(!user) {
        return next(httpErrors.Unauthorized(`User with email: ${decoded.username} doesn't exist`))
       }
       
       req.user = user
       next()

    } catch (e) {
 
        
        if(String(e.constructor.name) === 'JsonWebTokenError') {
            return next(httpErrors.BadRequest('Invalid/Expired jwt, adica nu ai voie boss'))
        }
    }
}

module.exports = auth

// bad request bad jwt / no jwt - validate with joi
// bad secret / expired token // jwt verify 
// no user found - find one null
