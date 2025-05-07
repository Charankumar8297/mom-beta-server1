const DeliveryBoy = require('../models/DeliveryBoy');


exports.createDeliveryBoy = async (req, res) => {
  try {
    const existing = await DeliveryBoy.findOne({ phoneNumber: req.body.phoneNumber });
    if (existing) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const deliveryBoy = new DeliveryBoy(req.body);
    await deliveryBoy.save();
    res.status(201).json(deliveryBoy);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find();
    res.status(200).json(deliveryBoys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getDeliveryBoyById = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.params.id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    res.status(200).json(deliveryBoy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    res.status(200).json(deliveryBoy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndDelete(req.params.id);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    res.status(200).json({ message: 'Delivery boy deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.login = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
      const DeliveryBoys = await DeliveryBoy.findOne({ phoneNumber });
      if (!DeliveryBoys) {
          return res.status(404).json({ message: 'DeliveryBoy not found' });
      }
      await DeliveryBoys.save();
      res.status(200).json({ message: 'logged' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error 123' });
  }
};