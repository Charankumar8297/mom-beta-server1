const DeliveryBoy = require('../models/DeliveryBoy');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require("nodemailer");

 const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = new twilio(accountSid, authToken);


  // Create a new user manually (optional route)
  const createDeliveryBoy = async (req, res) => {
    const { name,
      phoneNumber,
      gender,
      email,
      age,
      vehicleType,
      vehicleNumber,
      available,
      status,
      location,
      isRegistered} = req.body;

    try {
        const existingDeliveryBoy = await  DeliveryBoy.findOne({ phoneNumber });
        if (existingDeliveryBoy) {
        return res.status(400).json({ message: 'User already exists' });
        }

        const newDeliverBoy = new DeliveryBoy ({
        name,
        phoneNumber,
       
        gender,
  
        email,
        age,
        vehicleType,
        vehicleNumber,
        available,
        status,
        location,
        isRegistered: isRegistered || false
        });

        await newDeliverBoy.save();
        return res.status(201).json({ message: 'deliveryboy created successfully', deliveryBoy: newDeliverBoy });
    } catch (error) {
        console.error('Error creating deliveryboy:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    };


    
const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find();
    res.status(200).json(deliveryBoys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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

const otpLogin = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        let deliveryBoy = await DeliveryBoy.findOne({ phoneNumber });

        if (!deliveryBoy) {
            deliveryBoy = new DeliveryBoy({ phoneNumber });
            await deliveryBoy.save();
            console.log('DeliveryBoy created:', deliveryBoy);
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(`OTP for ${phoneNumber}: ${otp}`);

        const message = await client.messages.create({
            body:`Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phoneNumber}`
        });

        console.log('Message sent:', message.sid);
        req.session.otp = otp;
        req.session.deliveryBoyId = deliveryBoy._id;

        return res.status(200).json({ message: 'OTP sent successfully', deliveryBoyId: deliveryBoy._id });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


   const verifyOtp = async (req, res) => {
    const { otp, phoneNumber } = req.body;

    try {
        if (Number(req.session.otp) === Number(otp)) {
            const deliveryBoy = await DeliveryBoy.findOne({ phoneNumber });
            if (!deliveryBoy) {
                return res.status(404).json({ message: 'Deliveryboy not found' });
            }

            const token = jwt.sign({ deliveryBoyId: deliveryBoy._id }, process.env.JWT_SECRET);

            req.session.otp = null;
            req.session.deliveryBoyId = deliveryBoy._id;
            req.session.phoneNumber = deliveryBoy.phoneNumber;

            const isExist = !!deliveryBoy.name;

            return res.status(200).json({ message: 'OTP verified successfully', token, isExist });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


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
    getAllDeliveryBoys,
    getDeliveryBoyById,
    otpLogin,
    verifyOtp,
    updateDeliveryBoy,
    deleteDeliveryBoy
    };