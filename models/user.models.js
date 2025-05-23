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
        default: null,
    },
    age:
    {
        type:Number,
        default:null
    },
    bloodgroup:
    {

        type:String,
        default:null,
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
    ref: 'Addres', 
    default: null,  
  },
})

const Users = mongoose.model('User', userSchema) 
module.exports = Users;