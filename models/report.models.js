const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const reportSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Donar'
    },
    report:{
        type:String,
        required:true
    },
    Donar:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Donar'
    },
});
module.exports=mongoose.model('report',reportSchema);