const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    mobileNo:{
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth:{
        type: Date,
    },
    gender:{
        type: String,
        enum:["male" , "female" , "other"],
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isRegistered:{
        type: Boolean,
        default: false
    },
    primaryAddress: { 
        type: String,
        default: ""
      }
})

const Users = mongoose.model('User', userSchema) 
module.exports = Users;  
