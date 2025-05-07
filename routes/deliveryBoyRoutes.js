const express = require('express');
const router = express.Router();
const deliveryBoyController = require('../controllers/deliveryBoyController');

router.post('/add-delivery', deliveryBoyController.createDeliveryBoy);
router.get('/alldelivery', deliveryBoyController.getAllDeliveryBoys);
router.get('/:id', deliveryBoyController.getDeliveryBoyById);
router.put('/:id', deliveryBoyController.updateDeliveryBoy);
router.delete('/:id', deliveryBoyController.deleteDeliveryBoy);
router.post('/login',deliveryBoyController.login)

module.exports = router;