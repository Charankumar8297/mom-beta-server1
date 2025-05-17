const express = require('express')
const  router = express.Router()
const addressController = require("../controllers/addressController")
const Addres = require('../models/Addres')
const userAuth = require('../middlewares/userAuth')


//get , post, put/patch, delete


router.post('/add-address',userAuth, addressController.createAddress)
router.get('/alladdress', addressController.getAddress)
router.put('/update',userAuth, addressController.updateAddress)
router.delete('/delete',userAuth, addressController.deleteAddress)
router.get("/address" , userAuth , addressController.getAddressByUser)
router.put('/make-primary', userAuth, addressController.makePrimaryAddress);


module.exports = router 