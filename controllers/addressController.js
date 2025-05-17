const Address = require('../models/Addres');
const User = require('../models/user.models');
const mongoose = require('mongoose');

// Create new address
const createAddress = async (req, res) => {
  try {
    const { userid, state, city, street, pincode, currentLocation } = req.body;

    const address = new Address({
      userid: new mongoose.Types.ObjectId(userid),  // ensure ObjectId
      state,
      city,
      street, 
      pincode,
      currentLocation: {
        lattitude: currentLocation?.lattitude,
        logitude: currentLocation?.logitude,
      },
    });

    await address.save();
    res.status(201).json({ success: true, message: 'Address created', address });

  } catch (error) {
    console.error("Create Address Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all addresses
const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Get Address Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Make primary address
const makePrimaryAddress = async (req, res) => {
  const userId = req.userId;
  const addressId = req.params.id;

  try {
    const address = await Address.findOne({ _id: addressId, userid: userId });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found or unauthorized" });
    }

    await Address.updateMany({ userid: userId }, { $set: { isPrimary: false } });

    address.isPrimary = true;
    await address.save();

    await User.findByIdAndUpdate(userId, { primaryAddress: addressId });

    res.status(200).json({
      success: true,
      message: "Primary address set successfully",
      address,
    });
  } catch (error) {
    console.error("Set Primary Address Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { userid, state, city, street, pincode, currentLocation } = req.body;

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      {
        userid: new mongoose.Types.ObjectId(userid), // ensure ObjectId
        state,
        city,
        street,
        pincode,
        currentLocation: {
          lattitude: currentLocation?.lattitude,
          logitude: currentLocation?.logitude,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Address updated", address: updated });
  } catch (error) {
    console.error("Update Address Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error("Delete Address Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAddressByUser = async (req, res) => {
  const userId = req.userId; // Assuming req.userId is already set by middleware

  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find all addresses for the user
    const addresses = await Address.find({ userid: userId })
      .populate('') // Populate user data if necessary
      .lean();

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    res.status(200).json({ data: addresses, status: true });
  } catch (e) {
    console.error("Get Address Error:", e);
    res.status(500).json({ message: "Internal server error", error: e.message });
  }
};

  

module.exports = {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  getAddressByUser,
  makePrimaryAddress,
};
