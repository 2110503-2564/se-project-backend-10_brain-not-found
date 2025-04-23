const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name\n']
    },
    email:{
        type: String,
        required:[true,'Please add an email\n'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email\n'
        ]
    },
    role: {
        type:String,
        enum: ['user','admin','shopOwner'],
        default: 'user'
    },
    password: {
        type:String,
        required:[true,'Please add a password\n'],
        minlength: 6,
        select: false
    },
    tel: {
        type: String,
        required: [true, 'Please add a phone number\n'],
        unique: true,
        match: [
            /^(\d{3}-?\d{3}-?\d{4})$/, 
            'Please add a valid phone number\n'
        ]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type: Date,
        default:Date.now
    }
});

// Encypt password using bcrypt
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id:this._id} , process.env.JWT_SECRET ,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword=async function(enteredPassword) {
    return await bcrypt.compare (enteredPassword, this.password)
}

module.exports = mongoose.model('User',UserSchema);