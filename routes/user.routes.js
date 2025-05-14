const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')
const { registerUsers, otpLogin, startRoute, verifyOtp, deleteUser, getUserDetails, emailOtp } = require('../controllers/user.controllers')

//starter route
router.get('/', startRoute)

//otp login
router.post('/login',otpLogin)

//register user
router.put('/register', userAuth ,registerUsers)

//verify otp
router.post('/verify-otp', verifyOtp)

// delete user
router.delete('/delete-user/:id', userAuth , deleteUser)

//get user details 
router.get('/user-details' , userAuth , getUserDetails)

//send mail otp 
router.post('/email-otp', emailOtp )





module.exports = router