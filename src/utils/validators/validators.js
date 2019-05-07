const Joi = require('joi')


const isJwtProvided = (jwt) => {
    let error = null;
    const Jwtschema = Joi.string().required().regex(/Bearer .*/)
    Jwtschema.validate(jwt, (err, value) => {
        error = err
    })
    
    return error ? false : true
}

module.exports = {
    isJwtProvided: isJwtProvided
}