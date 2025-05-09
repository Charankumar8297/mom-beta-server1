const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  assignOrder,
  updateOrderStatus,
  updateOrderIsActive, 
   getOrderByUserId,
   orderByDeliveryBoyId
} = require('../controllers/order.controllers');
const userAuth = require('../middlewares/userAuth');


router.post('/add-order',userAuth, createOrder);


router.get('/allorders', getAllOrders);


router.get('/orderbyid/:id' , userAuth , getOrderById);


router.post('/:id/assign', assignOrder);


router.patch('/:id/status', updateOrderStatus);


router.patch('/:id/active', updateOrderIsActive);

router.get('/getorderuser/:_id', userAuth ,getOrderByUserId);
router.get('/getorderdeliveryboy/:_id',userAuth ,orderByDeliveryBoyId );

module.exports = router;
