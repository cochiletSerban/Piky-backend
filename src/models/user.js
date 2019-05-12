const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
    },
    role: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        default: true
    },
}, {toObject: {
}})

userSchema.virtual('entries', {
    ref: 'Entry',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('images', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'owner'
})

// this gets called always when accessing a document returned by a query
userSchema.methods.toJSON = function () {
    let user = this.toObject()
    user.email = this.email
    return user
}

// this gets called when populate is used
userSchema.options.toObject.transform = function (doc, ret) {
    delete ret.email
    delete ret.__v
    delete ret.active
    delete ret.images
    delete ret.entries
    delete ret.id
    return ret
}


//userSchema.set('toJSON', { virtuals: true })


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
        active: user.active
    }, 'secret')
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
   
    
    const user = await User.findOne({ email })
    

    if (!user) {
        throw new Error('Unable to login')
    }

    
    const isMatch = await bcrypt.compare(password, user.password)
    

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User