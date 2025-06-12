const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')
const {  getid,createUser,registerUsers, otpLogin, startRoute, verifyOtp, deleteUser, getUserDetails, emailOtp,updateUser,updateUserById  } = require('../controllers/user.controllers')
const User=require('../models/user.models')
//starter route
router.get('/', startRoute)
//otp login
router.post('/login',otpLogin)

//register user
router.put('/register', userAuth ,registerUsers)

//verify otp
router.post('/verify-otp', verifyOtp)

// delete user
router.delete('/delete-user/:id', deleteUser)

//get user details 
router.get('/user-details' ,userAuth,  getUserDetails)


//send mail otp     
router.post('/email-otp', emailOtp )

router.put('/updat/:id',updateUser)

 router.put('/user/update/:id', updateUserById);
router.post('/post',createUser)
router.put('/updateAddress' , userAuth, )

router.get('/getbyid/:id', getid)

router.get('/users', async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.json({ count });
    } catch (err) {
      console.error('Error in /users:', err);
      res.status(500).json({ error: 'Failed to fetch user count' });
    }
  });

module.exports = router
