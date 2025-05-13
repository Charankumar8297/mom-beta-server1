const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    mobileNo:{
        type: String,
       
    },
    dateOfBirth:{
        type: Date,
    },
    gender:{
        type: String,
        enum:["male" , "female" , "other"],
    },
    email:
    {
        type:String,
    },
    age:
    {
        type:Number
    },
    bloodgroup:
    {

        type:String
    },
    isAdmin:
    {
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