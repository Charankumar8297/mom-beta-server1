const Order = require('../models/order.models');
const DeliveryBoy = require('../models/DeliveryBoy');
const Earning = require('../models/Earning');
const DeliveryAssessment = require('../models/DeliveryAssessment');
const Medicine = require('../models/medicines/Productdetail.model.')
const mongoose = require('mongoose');

// Create Order
exports.createOrder = async (req, res) => {
  const user_id = req.userId;

  try {
    const {
      address_id,
      ETA = 10,
      medicines,
      subtotal,
      shippingFee = 0,
      tax = 0,
      discount = 0,
      total_amount,
      paymentMethod = 'COD',
      isActive = true,
    } = req.body;

    if (!address_id || !Array.isArray(medicines) || medicines.length === 0 || !subtotal || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields or invalid medicines list.',
      });
    }

    const newOrder = new Order({
      user_id,
      address_id,
      ETA,
      medicines,
      subtotal,
      shippingFee,
      tax,
      discount,
      total_amount,
      paymentMethod,
      isActive,
      status: 'confirmed',
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: newOrder,
    });

  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Manually assign delivery boy to an order

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
  // const userId = req.userId
  try {
    const order = await Order.findById({ _id: req.params.id })
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

exports.orderByDeliveryBoyId = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid delivery boy ID" });
    }

    const deliveryboyId = new mongoose.Types.ObjectId(_id);
    const orders = await Order.find({ deliveryboy_id: deliveryboyId })
      .populate('user_id')
      .populate('address_id');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const orders = await Order.find({ user_id: userObjectId })
      .populate({
        path: 'medicines.medicine_id',
        select: 'imageUrl medicine_name '
      })
      .populate('user_id')
      .populate('address_id')
      .populate('deliveryboy_id');

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this user with assigned delivery boy and address',
      });
    }

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('deliveryboy_id');


    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    if (status === 'delivered') {
      await updateEarnings(order);
      if (order.deliveryboy_id) {
        order.deliveryboy_id.isAvailable = 'yes';
        await order.deliveryboy_id.save();
      }
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


exports.updateOrderLocation = async (req, res) => {
  const { orderId } = req.params;
  const { latitude, longitude } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.currentLocation = { latitude, longitude };
    await order.save();

    return res.status(200).json({ success: true, message: 'Location updated', order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Order.deleteMany({ user_id: userId });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} order(s) deleted successfully for user ID: ${userId}`,
    });
  } catch (err) {
    console.error('Error deleting user orders:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.deleteAllOrders = async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} order(s) deleted successfully.`,
    });
  } catch (err) {
    console.error('Error deleting all orders:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const deliveryBoyId = req.deliveryBoyId;

  try {

    const deliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId, status: 'Online' });
    if (!deliveryBoy) {
      return res.status(403).json({ message: 'You must be online to accept orders' });
    }
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        deliveryboy_id: null,
        status: 'confirmed'
      },
      {
        $set: {
          deliveryboy_id: deliveryBoyId,
          status: 'on the way'
        }
      },
      { new: true }
    );


    if (!order) {
      return res.status(400).json({ message: 'Order already accepted or not available' });
    }


    await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, { status: 'Busy' });


    return res.status(200).json({
      message: 'Order accepted successfully',
      orderId: order._id,
      assignedTo: deliveryBoyId
    });
  } catch (error) {
    console.error("Error accepting order:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.delivered = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('deliveryboy_id');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Order already marked as delivered' });
    }

   
    order.status = 'delivered';
    await order.save();

    
    if (order.deliveryboy_id) {
      order.deliveryboy_id.status = 'Online';
      await order.deliveryboy_id.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Order marked as delivered',
      order,
    });

  } catch (err) {
    console.error('Error marking order as delivered:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};