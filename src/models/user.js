const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const bcypt = require ('bcrypt-nodejs') //hay que instalarla


const UserSchema = new Schema({
    email: { type: String, unique:true, lowercase: true },
    displayName: String,
    avatar: String,
    password: {type: String, select:false},
    signupDate:{type: Date, default: Date.now()},
    lastLogin: Date
})

UserSchema.pre('save', (next) => {
    let user= this
    if (!user.isModified('password')) return next ()

    bcrypt.genSalt(10, (err,salt) =>{
        if (err) returnnext(err)

    bcrypt.hash(user.password, salt, null,(err, hash) =>{
        if (err) return next(err)

        user.password = hash 
        next()
        })
    })
})