const DeliveryBoy = require('../models/DeliveryBoy');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Create a new DeliveryBoy manually
const createDeliveryBoy = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      vehicleType,
      AadharNumber,
      pancardNumber,
      storeId,
      drivingLicense,
      email,
      isRegistered,
      status,
    } = req.body;

    // Basic validation example
    if (!firstName || !lastName || !mobileNumber || !storeId) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const deliveryBoy = new DeliveryBoy({
      firstName,
      lastName,
      mobileNumber,
      vehicleType,
      AadharNumber,
      pancardNumber,
      storeId,
      drivingLicense,
      email,          // optional
      isRegistered,
      status,
    });

    await deliveryBoy.save();

    return res.status(201).json({ message: 'Delivery boy created', deliveryBoy });
  } catch (error) {
    console.error('Error creating delivery boy:', error);

    // Handle duplicate key error nicely
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value entered',
        error: error.keyValue,
      });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

// OTP login (register if not exists)
const otpLogin = async (req, res) => {
  const { phoneNumber, name } = req.body;

  try {
    let deliveryBoy = await DeliveryBoy.findOne({ mobileNumber: phoneNumber });

    if (!deliveryBoy) {
      deliveryBoy = new DeliveryBoy({ mobileNumber: phoneNumber, firstName: name || '', lastName: '' });
      await deliveryBoy.save();
      console.log('New delivery boy created:', deliveryBoy);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });

    req.session.otp = otp;
    req.session.deliveryBoyId = deliveryBoy._id;

    return res.status(200).json({
      message: 'OTP sent successfully',
      deliveryBoyId: deliveryBoy._id,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// OTP verification
const verifyOtp = async (req, res) => {
  const { otp, phoneNumber } = req.body;

  try {
    if (Number(req.session.otp) === Number(otp)) {
      const deliveryBoy = await DeliveryBoy.findOne({ mobileNumber: phoneNumber });
      if (!deliveryBoy) {
        return res.status(404).json({ message: 'Delivery boy not found' });
      }

      const token = jwt.sign({ deliveryBoyId: deliveryBoy._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Clear session OTP after verification
      req.session.otp = null;
      req.session.deliveryBoyId = deliveryBoy._id;
      req.session.phoneNumber = deliveryBoy.mobileNumber;

      const isExist = !!(deliveryBoy.firstName || deliveryBoy.lastName);

      return res.status(200).json({ message: 'OTP verified successfully', token, isExist });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all delivery boys
const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find();
    res.status(200).json(deliveryBoys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get delivery boy by ID
const getDeliveryBoyById = async (req, res) => {
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

// Update delivery boy
const updateDeliveryBoy = async (req, res) => {
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

// Delete delivery boy
const deleteDeliveryBoy = async (req, res) => {
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

module.exports = {
  createDeliveryBoy,
  otpLogin,
  verifyOtp,
  getAllDeliveryBoys,
  getDeliveryBoyById,
  updateDeliveryBoy,
  deleteDeliveryBoy
};
