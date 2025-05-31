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
   deleteAllOrders,
   acceptOrder,
   delivered
   


} = require('../controllers/order.controllers');
const userAuth = require('../middlewares/userAuth');
const deliveryBoyAuth = require('../middlewares/deliveryBoyAuth');


router.post('/add-order', userAuth, createOrder);


router.get('/allorders', getAllOrders);


router.get('/orderbyid/:id' , userAuth , getOrderById);




router.patch('/:id/status', updateOrderStatus);


router.patch('/:id/active', updateOrderIsActive);
router.delete('/delete-all-orders', deleteAllOrders);


router.get('/getorderuser', userAuth ,getOrderByUserId);
router.get('/getorderdeliveryboy/:_id',userAuth ,orderByDeliveryBoyId );
router.delete('/delete-orders-by-user/:userId', userAuth, deleteOrdersByUserId);



router.post('/orders/:orderId/accept', deliveryBoyAuth, acceptOrder);
router.post('/delivered/:orderId',delivered)



module.exports = router;