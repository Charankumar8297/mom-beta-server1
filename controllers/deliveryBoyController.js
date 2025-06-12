const DeliveryBoy = require('../models/DeliveryBoy');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require("nodemailer");
require('dotenv').config();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = new twilio(accountSid, authToken); 
    const client = require('twilio')(accountSid, authToken);



  // Create a new user manually (optional route)
  const createDeliveryBoy = async (req, res) => {
    const {
        name,
        mobileNumber,
          vehicleType,
          AadharNumber,
         pancardNumber,
          storeId,
           drivingLicense,
           status,
      isRegistered} = req.body;

    try {
        const existingDeliveryBoy = await  DeliveryBoy.findOne({ mobileNumber });
        if (existingDeliveryBoy) {
        return res.status(400).json({ message: 'User already exists' });
        }

        const newDeliverBoy = new DeliveryBoy ({
         name,
         mobileNumber,          
         vehicleType,
          AadharNumber,
         pancardNumber,
          storeId,
           drivingLicense,
           status,
        isRegistered: isRegistered || false
        });

        await newDeliverBoy.save();
        return res.status(201).json({ message: 'deliveryboy created successfully', deliveryBoy: newDeliverBoy });
    } catch (error) {
        console.error('Error creating deliveryboy:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    };


     // Register deliveryboy (update user details if not already registered)
     const registerDeliveryBoy = async (req, res) => {
      const { name, mobileNumber, vehicleType, AadharNumber, pancardNumber, storeId, drivingLicense, status } = req.body;
      const deliveryBoyId = req.deliveryBoyId;
  
      try {
          const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
          if (!deliveryBoy) {
              return res.status(404).json({ message: 'Delivery boy not found' });
          }
  
          if (deliveryBoy.isRegistered) {
              return res.status(400).json({ message: 'User already registered' });
          }
  
          await DeliveryBoy.updateOne(
              { _id: deliveryBoyId },
              {
                  name,
                  mobileNumber,
                  vehicleType,
                  AadharNumber,
                  pancardNumber,
                  storeId,
                  drivingLicense,
                  status,
                  isRegistered: true
              }
          );
  
          return res.status(201).json({ message: 'Delivery boy registered successfully', deliveryBoyId });
      } catch (error) {
          console.error('Error registering delivery boy:', error);
          return res.status(500).json({ message: 'Internal server error' });
      }
  };
  

    
const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find().sort({name:1});
    res.status(200).json(deliveryBoys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getDeliveryBoyById = async (req, res) => {
  const deliveryBoyId = req.deliveryBoyId;
  try {
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }
    res.status(200).json(deliveryBoy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getStatus = async (req, res) => {
  try {
    const activeCount = await DeliveryBoy.countDocuments({ status: 'Online' });
    const inactiveCount = await DeliveryBoy.countDocuments({ status: { $ne: 'Online' } });

    return res.status(200).json({
      active: activeCount,
      inactive: inactiveCount,
    });
  } catch (error) {
    console.error('Error fetching delivery boy status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const getBoys = async (req, res) => {
  try {
    const count = await DeliveryBoy.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCount = async (req, res) => {
  try {
    const count = await DeliveryBoy.countDocuments({ isRegistered: true });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting registered delivery boys count:', error);
    res.status(500).json({ message: 'Failed to fetch count' });
  }
};

const otpLogin = async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        let deliveryBoy = await DeliveryBoy.findOne({ mobileNumber });

        if (!deliveryBoy) {
            deliveryBoy = new DeliveryBoy({ mobileNumber });
            await deliveryBoy.save();
            console.log('DeliveryBoy created:', deliveryBoy);
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(`OTP for ${mobileNumber}: ${otp}`);

        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobileNumber}`
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
    const { otp, mobileNumber} = req.body;

    try {
        if (Number(req.session.otp) === Number(otp)) {
            const deliveryBoy = await DeliveryBoy.findOne({   mobileNumber });
            if (!deliveryBoy) {
                return res.status(404).json({ message: 'Deliveryboy not found' });
            }

            const token = jwt.sign({ deliveryBoyId: deliveryBoy._id }, process.env.JWT_SECRET);

            req.session.otp = null;
            req.session.deliveryBoyId = deliveryBoy._id;
            req.session.mobileNumber = deliveryBoy. mobileNumber;

            const isExist = !!(deliveryBoy.name);
            console.log('OTP verified successfully for:', deliveryBoy.mobileNumber);
            console.log('Token generated:', token);


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
  const deliveryBoyId = req.deliveryBoyId;
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, req.body, {
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


const updateLoginHours = async (req, res) => {
  const { status } = req.body;
  const deliveryBoyId = req.deliveryBoyId;

  try {
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }

    if (status && status !== deliveryBoy.status) {
      if (status === 'Online') {
        const lastSession = deliveryBoy.loginSessions[deliveryBoy.loginSessions.length - 1];
        if (!lastSession || lastSession.logoutTime) {
          deliveryBoy.loginSessions.push({ loginTime: new Date() });
        }
      } else if (status === 'Offline') {
        const lastSession = deliveryBoy.loginSessions[deliveryBoy.loginSessions.length - 1];
        if (lastSession && !lastSession.logoutTime) {
          const logoutTime = new Date();
          const loginTime = new Date(lastSession.loginTime);
          const sessionDuration = logoutTime - loginTime; 

          lastSession.logoutTime = logoutTime;
          deliveryBoy.totalOnlineTimeInMs = (deliveryBoy.totalOnlineTimeInMs || 0) + sessionDuration;
        }
      }

      deliveryBoy.status = status;
    }
    Object.keys(req.body).forEach(key => {
      if (key !== 'status') {
        deliveryBoy[key] = req.body[key];
      }
    });

    await deliveryBoy.save();

    res.status(200).json({
      message: 'Status and time updated successfully',
      totalOnlineTimeInMs: deliveryBoy.totalOnlineTimeInMs
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteDeliveryBoy = async (req, res) => {
  const deliveryBoyId = req.deliveryBoyId;
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndDelete(deliveryBoyId);
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
    registerDeliveryBoy,
    otpLogin,
    verifyOtp,
    updateDeliveryBoy,
    deleteDeliveryBoy,
    updateLoginHours,
    getStatus,
    getBoys,
    getCount
    };