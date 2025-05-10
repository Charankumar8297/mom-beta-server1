
const Earning = require('../models/Earning')

const createEarning = async (req, res) => {
  try {
    const earning = new Earning(req.body);
    await earning.save();
    res.status(201).json({ message: 'Earning record created', earning });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllEarnings = async (req, res) => {
  try {
    const earnings = await Earning.find();
    res.status(200).json(earnings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEarningByAgentId = async (req, res) => {
  try {
    const earning = await Earning.findOne({ delivery_agent_id: req.params.id });
    if (!earning) {
      return res.status(404).json({ message: 'Earning record not found' });
    }
    res.status(200).json(earning);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEarning = async (req, res) => {
  try {
    const updatedEarning = await Earning.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedEarning) {
      return res.status(404).json({ message: 'Earning record not found' });
    }
    res.status(200).json({ message: 'Earning record updated', updatedEarning });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addOrderEarning = async (req, res) => {
  try {
    const { delivery_agent_id } = req.params;
    const { order_id, base_earning = 20, bonus = 0, deduction = 0 } = req.body;

    const earning = await Earning.findOne({ delivery_agent_id });

    if (!earning) {
      return res.status(404).json({ message: 'Earning record not found' });
    }

    const total_earning = base_earning + bonus - deduction;

    earning.current_balance += total_earning;
    earning.total_earned += total_earning;
    earning.total_orders += 1;

    earning.order_earnings.push({
      order_id,
      date: new Date(),
      base_earning,
      bonus,
      deduction,
      total_earning
    });

    await earning.save();

    res.status(200).json({ message: 'Order earning added successfully', earning });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Automatically update earning after delivery
const updateEarningAfterDelivery = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findOne({ _id: order_id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Earnings have already been updated for this delivered order.' });
    }

    order.status = 'delivered';
    await order.save();

    const earning = await Earning.findOne({ delivery_agent_id: order.deliveryboy_id });

    if (!earning) {
      return res.status(404).json({ message: 'Earnings record not found for this delivery boy' });
    }

    const orderEarning = 20;
    const bonus = 0;
    const deduction = 0;
    const totalEarning = orderEarning + bonus - deduction;

    earning.current_balance += totalEarning;
    earning.total_earned += totalEarning;
    earning.total_orders += 1;

    earning.order_earnings.push({
      order_id: order._id,
      date: new Date(),
      base_earning: orderEarning,
      bonus,
      deduction,
      total_earning: totalEarning
    });

    await earning.save();

    res.status(200).json({
      message: 'Earnings updated successfully for this order.',
      earning
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEarning,
  getAllEarnings,
  getEarningByAgentId,
  updateEarning,
  addOrderEarning,
  updateEarningAfterDelivery
};