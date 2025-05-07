const ActiveOrder = require('../models/ActiveOrder')
const mongoose = require('mongoose');


exports.addOrderToActive = async (req, res) => {
  const { user_id, orderId } = req.body;

  if (!user_id || !orderId) {
    return res.status(400).json({ message: 'user_id and orderId are required' });
  }

  try {
    let activeOrder = await ActiveOrder.findOne({ user_id });

    if (activeOrder) {
      
      if (!activeOrder.orders.includes(orderId)) {
        activeOrder.orders.push(orderId);
        activeOrder.timestamp = Date.now();
        await activeOrder.save();
      }
    } else {
      
      activeOrder = new ActiveOrder({
        user_id,
        orders: [orderId]
      });
      await activeOrder.save();
    }

    res.status(200).json(activeOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get active orders for a user
exports.getActiveOrdersByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const activeOrder = await ActiveOrder.findOne({ user_id }).populate('orders');
    if (!activeOrder) {
      return res.status(404).json({ message: 'No active orders found' });
    }

    res.status(200).json(activeOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove an order from active list (optional)
exports.removeOrderFromActive = async (req, res) => {
  const { user_id, orderId } = req.body;

  try {
    const activeOrder = await ActiveOrder.findOne({ user_id });
    if (!activeOrder) {
      return res.status(404).json({ message: 'Active order not found' });
    }

    activeOrder.orders = activeOrder.orders.filter(
      id => id.toString() !== orderId
    );
    activeOrder.timestamp = Date.now();
    await activeOrder.save();

    res.status(200).json(activeOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
