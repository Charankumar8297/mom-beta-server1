const Earnings = require("../models/Earning");
// 8473847598844ioerhjhfkjhfdjhssjd
const createEarning = async (req, res) => {
  try {
    const  agentId = req.deliveryBoyId
    
    const { orderId, base_earning, bonus, deduction, ETA, total_earning, EarningStatus } = req.body;
    const findEarning = await Earnings.findOne({ deliveryId: agentId });
    console.log('Agent ID:',findEarning);
    if (!findEarning) {
      console.log('Creating new earning for agent:', agentId);
      const newEarning = new Earnings({
        deliveryId: agentId,
        orders: [{
          order_id: orderId,
          base_earning: base_earning || 20,
          bonus: bonus || 0,
          deduction: deduction || 0,
          total_earning: total_earning || 20,
          ETA: ETA || 0,
          EarningStatus: EarningStatus || 'pending'
        }]
      });
      await newEarning.save();
      return res.status(201).json({ message: 'Earning created successfully', earning: newEarning });

    }
    const newOrder = {
      order_id: orderId,
      base_earning: base_earning || 20,
      bonus: bonus || 0,
      deduction: deduction || 0,
      total_earning: total_earning || 20,
      ETA: ETA || 0,
      EarningStatus: EarningStatus || 'pending'
    }

    findEarning.orders.push(newOrder);
    findEarning.total_earning += newOrder.total_earning;
    await findEarning.save();

    return res.status(200).json({ message: 'Earning updated successfully', earning: findEarning }); tt

  } catch (error) {
    console.error('Error creating earning:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const getEarningByAgentId = async (req, res) => {
  try {
    const  agentId  = req.deliveryBoyId;
    console.log("this is from route", agentId)
    const earning = await Earnings.findOne({ deliveryId: agentId });
    if (!earning) {
      return res.status(404).json({ message: 'Earning not found for this agent' });
    }
    res.status(200).json({ earning });
  } catch (e) {
    console.error('Error fetching earning by agent id:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const getAllEarnings = async (req, res) => {
  try {
    const earnings = await Earnings.find()
    if (!earnings || earnings.length === 0) {
      return res.status(404).json({ message: 'No earnings found' });
    }
    res.status(200).json({ earnings })
  } catch (error) {
    console.error('Error fetching all earnings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const getPendingByAgentId = async (req, res) => {
  const { status } = req.params
  try {
    const agentId = req.deliveryBoyId
    console.log("this is from route", agentId)
    const earnings = await Earnings.find({ deliveryId: agentId, 'orders.EarningStatus': status });

    if (!earnings || earnings.length === 0) {
      return res.status(404).json({ message: `No ${status} earnings found for this agent` });
    }
    const pendingEarnings = earnings.map(earning => ({
      deliveryId: earning.deliveryId,
      orders: earning.orders.filter(order => order.EarningStatus === status)
    }));
    return res.status(200).json({ pendingEarnings });
  } catch (error) {
    console.error('Error fetching pending earnings by agent id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const completedEarningsByAgentId = async (req, res) => {

  const agentId = req.deliveryBoyId; // Replace with actual agent ID if needed
  try {

    const earning = await Earnings.find({ deliveryId: agentId, 'orders.EarningStatus': 'completed' });
    if (!earning || earning.length === 0) {
      return res.status(404).json({ message: 'No completed earnings found for this agent' });
    }

    const completedEarnings = earning.map(earn => ({
      deliveryId: earn.deliveryId,
      orders: earn.orders.filter(order => order.EarningStatus === 'completed')
    })
    );

    res.status(200).json({ earnings: completedEarnings });

  } catch (error) {
    console.error('Error fetching completed earnings by agent id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const dateRangeEarningsByAgentId = async (req, res) => {
  const agentId = req.deliveryBoyId // Replace with actual agent ID if needed
  console.log("this is from route", agentId)
  try {
    const [startDate, endDate] = req.params.date.split(',').map(date => new Date(date.trim()));
    endDate.setHours(23, 59, 59, 999); // Set end date to the end of the day
    const findEarning = await Earnings.findOne({
      deliveryId: agentId,
      orders: {
        $elemMatch: {
          createdAt: { $gte: startDate, $lte: endDate },
        }
      }
    });
    console.log(findEarning)
    if (!findEarning) {
      return res.status(404).json({ message: 'Earning not found for this agent' });
    }

    const totalEarnings = findEarning.orders.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startDate && orderDate <= endDate) {
        return acc + order.total_earning;
      }
      return acc;
    }, 0);

    const earnings = findEarning.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate && order.EarningStatus === 'pending';
    });

    const completedEarning = findEarning.orders.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startDate && orderDate <= endDate && order.EarningStatus === 'completed') {
        return acc + order.total_earning;
      }
      return acc;
    }, 0);
    res.status(200).json({ earnings: earnings, completedEarning , totalEarnings });

  } catch (error) {
    console.error('Error fetching earnings by date range:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateEarningById = async (req, res) => {
  try {
    const agentId = req.deliveryBoyId // Replace with actual agent ID if needed
    const update = await Earnings.updateOne(
  { deliveryId: agentId },
  {
    $set: {
      "orders.$[].EarningStatus": "completed",
    }
  }
);
    console.log(update)
    res.status(200).json({ message: 'Earning updated successfully', update });
  }
  catch (error) {
    console.error('Error updating earning by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = { createEarning, getEarningByAgentId, getAllEarnings, getPendingByAgentId, completedEarningsByAgentId, dateRangeEarningsByAgentId, updateEarningById };