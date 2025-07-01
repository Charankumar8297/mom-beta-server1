const express = require('express');
const router = express.Router();
const user = require('../middlewares/userAuth');
const { verifyRazorpay, verifyPayU } = require('../controllers/payment.controllers');
const userAuth = require('../middlewares/userAuth');

router.post('/verify/razorpay',userAuth, verifyRazorpay);
router.post('/verify/payu', userAuth,verifyPayU);

module.exports = router;