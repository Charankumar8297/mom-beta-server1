const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    username:{
        type:String , 
        required:true
    },
    email:{
        type:String , 
    },
    phoneNumber:{
        type:Number, 
        required:true
    },
    password:{
        type:String , 
        required:true
    }
})

const Admin = mongoose.model("Admin" , AdminSchema)
module.exports = Admin