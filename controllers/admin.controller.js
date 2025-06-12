const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Admin = require("../models/Admin.models")


const createAdmin = async (req , res)=>{
    const {username , email , phoneNumber , password} = req.body 
    try{
        if(!username && !email && !phoneNumber && !password ){
            return res.status(400).json({msg:"All fields are mandatory"})
        }

        const hashPass = bcrypt.hashSync(password , 10)
        
        console.log(hashPass)

        const createAdmin = await Admin.create({
            username , email , phoneNumber , password:hashPass
        })

        await createAdmin.save()

        res.status(201).json({createAdmin})


    }catch(e){
        console.log(e)
        res.status(500).json({msg:"Internal server error" , e})
    }
}

const loginAdmin =  async (req , res)=>{
    const {username , password} = req.body 
    try{
        const checkAdmin = await Admin.findOne({username})
        if(!checkAdmin){
            return res.status(404).json({msg:"Admin not found"})
        }

        const isPassword = bcrypt.compareSync(password  , checkAdmin.password)
        if(!isPassword){
            return res.status(404).json({msg:"Password is incorrect"})
        }

        jwt.sign({AdminId:checkAdmin._id , username } ,process.env.SECRET_KEY , (err , token)=>{
            if(err){
                 return res.status(405).json({msg:"Forbidden"})
                }
            res.status(201).json({jwtToken:token})
        } )
    }catch(e){
        res.status(500).json({error:e})
    }

}

const getAdminDetails = async (req , res)=>{
    const adminId = req.adminId 
    try{
        const admin = await Admin.findOne({_id:adminId})
        res.status(200).json({data:admin})
    }catch(e){
        console.log("internal server")
        res.status(500).json({msg:"Internal server error"})

    }
}



module.exports = {createAdmin , loginAdmin , getAdminDetails}