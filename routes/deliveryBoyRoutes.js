const express = require('express');
 const router = express.Router();
 const deliveryBoyAuth = require('../middlewares/deliveryBoyAuth');
  const deliveryBoyController = require('../controllers/deliveryBoyController');

router.post('/add-delivery', deliveryBoyController.createDeliveryBoy);
//otp login
router.post('/login',deliveryBoyController.otpLogin)
//verify otp
router.post('/verify-otp', deliveryBoyController.verifyOtp)
router.get('/alldelivery', deliveryBoyController.getAllDeliveryBoys);
router.get('/deliveryboy', deliveryBoyAuth, deliveryBoyController.getDeliveryBoyById);
router.put('/update', deliveryBoyAuth,deliveryBoyController.updateDeliveryBoy);
router.delete('/delete', deliveryBoyAuth, deliveryBoyController.deleteDeliveryBoy);
router.post('/register', deliveryBoyAuth, deliveryBoyController.registerDeliveryBoy);
router.get('/alldeliverycount', deliveryBoyController.getCount);
router.get('/status', deliveryBoyController.getStatus);
// router.get('/alldelivery-hi', deliveryBoyController.getBoys);
router.put('/loginhours',deliveryBoyAuth,deliveryBoyController.updateLoginHours)
module.exports = router;