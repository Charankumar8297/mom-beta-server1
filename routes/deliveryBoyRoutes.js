const express = require('express');
 const router = express.Router();
 const deliveryBoyAuth = require('../middlewares/deliveryBoyAuth')
  const deliveryBoyController = require('../controllers/deliveryBoyController');

router.post('/add-delivery', deliveryBoyController.createDeliveryBoy);
//otp login
router.post('/login',deliveryBoyController.otpLogin)
//verify otp
router.post('/verify-otp', deliveryBoyController.verifyOtp)
router.get('/alldelivery', deliveryBoyController.getAllDeliveryBoys);
router.get('/deliveryboy', deliveryBoyAuth, deliveryBoyController.getDeliveryBoyById);
router.put('/update/:id', deliveryBoyAuth,deliveryBoyController.updateDeliveryBoy);
router.delete('/delete/:id', deliveryBoyController.deleteDeliveryBoy);



module.exports = router;