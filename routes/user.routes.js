const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')
const { createUser,registerUsers, otpLogin, startRoute, verifyOtp, deleteUser, getUserDetails, emailOtp,updateUser,updateUserById  } = require('../controllers/user.controllers')

//starter route
router.get('/all', startRoute)

//otp login
router.post('/login',otpLogin)

//register user
router.put('/register', userAuth ,registerUsers)

//verify otp
router.post('/verify-otp', verifyOtp)

// delete user
router.delete('/delete-user/:id', deleteUser)

//get user details 
router.get('/user-details' , getUserDetails)

//send mail otp     
router.post('/email-otp', emailOtp )

router.put('/updat/:id',updateUser)

router.put('/user/update/:id', updateUserById);
router.post('/post',createUser)



module.exports = router