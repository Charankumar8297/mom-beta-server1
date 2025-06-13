const express = require('express');
 const router = express.Router();
 const deliveryBoyAuth = require('../middlewares/deliveryBoyAuth');
  const deliveryBoyController = require('../controllers/deliveryBoyController');

router.post('/add-delivery', deliveryBoyController.createDeliveryBoy);
//otp login
router.post('/login',deliveryBoyController.otpLogin)
//verify otp
router.post('/verify-otp', deliveryBoyController.verifyOtp)
router.get('/deliveryboy', deliveryBoyAuth, deliveryBoyController.getDeliveryBoyById);
router.put('/update', deliveryBoyAuth,deliveryBoyController.updateDeliveryBoy);
router.delete('/delete', deliveryBoyAuth, deliveryBoyController.deleteDeliveryBoy);
router.post('/register', deliveryBoyAuth, deliveryBoyController.registerDeliveryBoy);
router.get('/deliveryboybyid/:id', deliveryBoyController.getDeliveryBoyByIdID);
router.get('/alldeliverycount', deliveryBoyController.getCount);
router.get('/status', deliveryBoyController.getStatus);
router.put('/loginhours',deliveryBoyAuth,deliveryBoyController.updateLoginHours)
module.exports = router;