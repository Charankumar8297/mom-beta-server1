const express = require('express')
const  router = express.Router()
const addressController = require("../controllers/addressController")
const Addres = require('../models/Addres')
const userAuth = require('../middlewares/userAuth')


//get , post, put/patch, delete


router.post('/add-address', addressController.createAddress)
router.get('/alladdress', addressController.getAddress)
router.put('/update/:id', addressController.updateAddress)
router.delete('/delete/:id', addressController.deleteAddress)
router.get("/address" , userAuth , addressController.getAddressByUser)


module.exports = router