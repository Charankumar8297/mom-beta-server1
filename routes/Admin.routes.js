const express = require("express")
const { createAdmin, loginAdmin, getAdminDetails } = require("../controllers/admin.controller")
const verifyAdmin = require("../middlewares/AdminVerify")

const router = express.Router()

// router.get("/"  , (req , res)=>{
//     res.send("this is not with any path in routes")
// })

//create admin post bcypt
router.post("/" ,createAdmin)

//login 
router.post('/login' , loginAdmin)
//get admin

router.get("/admin" , verifyAdmin , getAdminDetails)







module.exports = router