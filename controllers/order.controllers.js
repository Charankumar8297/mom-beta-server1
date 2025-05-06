const Order = require('../models/order.models');
const DeliveryBoy = require('../models/DeliveryBoy');
const Earning = require('../models/Earning');
const DeliveryAssessment = require('../models/DeliveryAssessment');
const Medicine = require('../models/medicine')

// Create Order
exports.createOrder = async (req, res) => {
  const user_id = req.userId
  try {
    const {
      address_id,
      ETA,
      medicines,
      total_amount,
      deliveryFee = 0,
      handlingFee = 0,
      isActive = true,
    } = req.body;

    const newOrder = new Order({
      user_id,
      address_id,
      ETA,
      medicines,
      total_amount,
      deliveryFee,
      handlingFee,
      isActive,
      status: 'confirmed',
    });

    await newOrder.save();

    const availableBoys = await DeliveryBoy.find({ isAvailable: 'yes' });

    if (availableBoys.length > 0) {
      const deliveryBoy = availableBoys[0];
      newOrder.deliveryboy_id = deliveryBoy._id;
      await newOrder.save();

      deliveryBoy.isAvailable = 'no';
      await deliveryBoy.save();

      return res.status(201).json({
        success: true,
        message: 'Order confirmed and delivery boy assigned',
        order: newOrder,
        deliveryBoy,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order confirmed. No delivery boy available',
      order: newOrder,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Manually assign delivery boy to an order
exports.assignOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.deliveryboy_id) {
      return res.status(400).json({ success: false, message: 'Delivery boy already assigned' });
    }

    const availableBoys = await DeliveryBoy.find({ isAvailable: 'yes' });

    if (availableBoys.length === 0) {
      return res.status(400).json({ success: false, message: 'No available delivery boys' });
    }

    const deliveryBoy = availableBoys[0];
    order.deliveryboy_id = deliveryBoy._id;
    await order.save();

    deliveryBoy.isAvailable = 'no';
    await deliveryBoy.save();

    res.status(200).json({
      success: true,
      message: 'Delivery boy manually assigned.',
      order,
      deliveryBoy,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user_id')
      .populate('address_id')
      .populate('deliveryboy_id');

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user_id')
      .populate('address_id')
      .populate('deliveryboy_id');
    

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    if (status === 'delivered') {
      await updateEarnings(order);
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update order isActive flag
exports.updateOrderIsActive = async (req, res) => {
  try {
    const { isActive } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isActive = isActive;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order isActive updated to ${isActive}`,
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Internal: Update earnings and delivery assessment on delivery
const updateEarnings = async (order) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(order.deliveryboy_id);
    if (!deliveryBoy) return;

    let earnings = await Earning.findOne({ delivery_agent_id: deliveryBoy._id });

    if (!earnings) {
      earnings = new Earning({
        delivery_agent_id: deliveryBoy._id,
        current_balance: order.total_amount,
        total_earned: order.total_amount,
        total_orders: 1,
      });
    } else {
      earnings.current_balance += order.total_amount;
      earnings.total_earned += order.total_amount;
      earnings.total_orders += 1;
    }

    await earnings.save();

    const assessment = new DeliveryAssessment({
      order_id: order._id,
      assignment_data_and_time: order.createdAt,
      delivery_date_time: new Date(),
      feedback: 'Delivered successfully',
    });

    await assessment.save();
  } catch (err) {
    console.error('Error updating earnings:', err.message);
  }
};
