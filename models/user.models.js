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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Addres',  // Reference to the Address model
    default: null,  // Make sure default is null until the user selects a primary address
  },
})

const Users = mongoose.model('User', userSchema) 
module.exports = Users;