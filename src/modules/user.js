const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (typeof (value) !== "string")
                throw new Error('make sure the name is a string')
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('make sure you entere a valid email')
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password"))
                throw new Error("you can't set your password as a password")
        }
    },
    age: {
        type: Number,
        default: 0,
        max: 120,
        validate(value) {
            if (value < 0)
                throw new Error("age must be a positive number")
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: "_id",
    foreignField: "owner"

})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar
    return userObject
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error("unable to login")
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new Error("unable to login")
    return user
}
//hash the pass pefore saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})
// remove the task when a user is deleted
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user.id })
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User;