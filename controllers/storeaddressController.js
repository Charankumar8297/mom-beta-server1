const StoreAddress = require('../models/storeaddress');

const mongoose = require('mongoose');

//create new storeAddress
const createStoreAddress = async (req, res) => {
    try{
        const { DoorNo, Street, Building, Pincode, City, CurrentLocation} = req.body;
        const StoreAddress1 = new StoreAddress({
            DoorNo, 
            Street, 
            Building, 
            Pincode, 
            City, 
            CurrentLocation: {
                latitude: CurrentLocation?.latitude,
                longitude: CurrentLocation?.longitude,
            },
        });
        await StoreAddress1.save();
        res.status(201).json({ success: true, message: 'StoreAddress created', StoreAddress});
    }catch (error) {
        console.error("Create StoreAddress Error: ", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all store addresses
const getStoreAddress = async (req, res) => {
    try {
        const StoreAddress1 = await StoreAddress.find();
        res.status(200).json({ success: true, StoreAddress1});
      } catch (error) {
        console.error("Get StoreAddress Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    };

// get StoreAddress by id
const getStoreAddressById = async (req, res) => {
    const StoreAddressId = req.params.id;
    try {
        const StoreAddress1 = await StoreAddress.findById(StoreAddressId);
        if (!StoreAddress1) {
            return res.status(404).json({ success: false, message: "StoreAddress not found" });
        } 
        return res.status(200).json({ success: true, StoreAddress1 });
    }catch (error) {
        console.error("Get StoreAddress by ID Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Make primary address
const makePrimaryAddress = async (req, res) => {
  // const StoreAddressId = req.StoreAddressId;
  const StoreAddressId = req.params.id;

  try {
    const StoreAddress = await StoreAddress.findOne({ _id: StoreAddressId});
    if (!StoreAddress) {
      return res.status(404).json({ success: false, message: "StoreAddress not found or unauthorized" });
    }

    await StoreAddress.updateMany({ $set: { isPrimary: false } });

    StoreAddress.isPrimary = true;
    await StoreAddress.save();

    // await StoreAddress.findByIdAndUpdate(StoreAddressId, { primaryAddress: address });

    res.status(200).json({
      success: true,
      message: "Primary StoreAddress set successfully",
      address,
    });
  } catch (error) {
    console.error("Set Primary StoreAddress Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update StoreAddress by id
const updateStoreAddress = async (req, res) => {
    try {
        const {DoorNo, Street, Building, Pincode, City, CurrentLocation} = req.body;

        const updated = await StoreAddress.findByIdAndUpdate(
            req.params.id,
            {
                DoorNo, 
                Street, 
                Building, 
                Pincode, 
                City, 
                CurrentLocation: {
                    latitude: CurrentLocation?.latitude,
                    longitude: CurrentLocation?.longitude,
                },
            },
            { new: true }
        );

        
    if (!updated) {
        return res.status(404).json({ success: false, message: "StoreAddress not found" });
      }
  
      res.status(200).json({ success: true, message: "StoreAddress updated", StoreAddress: updated });
    } catch (error) {
      console.error("Update StoreAddress Error:", error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // delete StoreAddress by id
  const deleteStoreAddress = async (req, res) => {
    try {
      const deleted = await StoreAddress.findByIdAndDelete(req.params.id);
  
      if (!deleted) {
        return res.status(404).json({ success: false, message: "StoreAddress not found" });
      }
  
      res.status(200).json({ success: true, message: "StoreAddress deleted" });
    } catch (error) {
      console.error("Delete Address Error:", error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  module.exports = {
    createStoreAddress,
    getStoreAddress,
    getStoreAddressById,
    makePrimaryAddress,
    updateStoreAddress,
    deleteStoreAddress
  };