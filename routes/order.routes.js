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
   orderByDeliveryBoyId,
   deleteOrdersByUserId,
   deleteAllOrders

} = require('../controllers/order.controllers');
const userAuth = require('../middlewares/userAuth');


router.post('/add-order', userAuth, createOrder);


router.get('/allorders', getAllOrders);


router.get('/orderbyid' , userAuth , getOrderById);


router.post('/:id/assign', assignOrder);


router.patch('/:id/status', updateOrderStatus);


router.patch('/:id/active', updateOrderIsActive);
router.delete('/delete-all-orders', deleteAllOrders);


router.get('/getorderuser/:_id', userAuth ,getOrderByUserId);
router.get('/getorderdeliveryboy/:_id',userAuth ,orderByDeliveryBoyId );
router.delete('/delete-orders-by-user/:userId', userAuth, deleteOrdersByUserId);

module.exports = router;
