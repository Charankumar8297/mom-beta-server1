const jwt = require("jsonwebtoken")

const verifyAdmin = (req ,res , next)=>{
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }
    console.log(token)
    try{
        jwt.verify(token , process.env.SECRET_KEY , (err , decode)=>{
            if(err) return res.status(405).json({msg:"forbidden"})
            console.log(decode)
            req.adminId = decode.AdminId
            next()  
        })
    }catch(e){
        res.status(500).json({msg:"Internal server" , e})
    }
}

module.exports = verifyAdmin