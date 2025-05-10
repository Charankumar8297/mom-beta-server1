const Order = require('../models/order.models');
const DeliveryBoy = require('../models/DeliveryBoy');
const Earning = require('../models/Earning');
const DeliveryAssessment = require('../models/DeliveryAssessment');
const Medicine = require('../models/medicines/Productdetail.model.')

// Create Order
exports.createOrder = async (req, res) => {
  const user_id = req.userId;

  try {
    const {
      address_id,
      ETA = 10,
      medicines,
      total_amount,
      deliveryFee = 0,
      handlingFee = 0,
      isActive = true,
    } = req.body;

    // ✅ Basic validation to avoid empty or invalid data
    if (!address_id || !Array.isArray(medicines) || medicines.length === 0 || !total_amount) {
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
    console.error("Order creation error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
  // const userId = req.userId
  try {
    const order = await Order.findById({_id:req.params.id })
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
  const userId = req.params.id; 

  try {
    const orders = await Order.find({
      user_id: userId,
      deliveryboy_id: { $ne: null },
      address_id: { $ne: null },
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

// Internal: Update earnings and delivery assessment on delivery

const updateEarnings = async (order) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(order.deliveryboy_id);
    if (!deliveryBoy) return;

    const baseEarning = 20;
    const bonus = 0;
    const deduction = 0;
    const totalEarning = baseEarning + bonus - deduction;

    let earnings = await Earning.findOne({ delivery_agent_id: deliveryBoy._id });

    if (!earnings) {
      earnings = new Earning({
        delivery_agent_id: deliveryBoy._id,
        current_balance: totalEarning,
        total_earned: totalEarning,
        total_orders: 1,
        order_earnings: [{
          order_id: order._id,
          date: new Date(),
          base_earning: baseEarning,
          bonus: bonus,
          deduction: deduction,
          total_earning: totalEarning
        }]
      });
    } else {
      earnings.current_balance += totalEarning;
      earnings.total_earned += totalEarning;
      earnings.total_orders += 1;

      earnings.order_earnings.push({
        order_id: order._id,
        date: new Date(),
        base_earning: baseEarning,
        bonus: bonus,
        deduction: deduction,
        total_earning: totalEarning
      });
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

