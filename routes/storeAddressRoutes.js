const express = require('express');
const router = express.Router();
const storeAddressController = require('../controllers/storeaddressController');
const StoreAddress = require('../models/storeaddress');

//post, get, put, delete

router.post('/add-StoreAddress', storeAddressController.createStoreAddress)
router.get('/allStoreAddress', storeAddressController.getStoreAddress)
router.get('/StoreAddress/:id', storeAddressController.getStoreAddressById)
router.put('/makePrimary/:id', storeAddressController.makePrimaryAddress)
router.put('/update/:id', storeAddressController.updateStoreAddress)
router.delete('/delete/:id', storeAddressController.deleteStoreAddress)

module.exports = router