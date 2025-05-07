const express = require('express');
const router = express.Router();
const activeOrderController = require("../controllers/ActiveOrderController");

router.post('/active-orders', activeOrderController.addOrderToActive);
router.get('/active-orders/:user_id', activeOrderController.getActiveOrdersByUser);
router.delete('/active-orders', activeOrderController.removeOrderFromActive);

module.exports = router;
