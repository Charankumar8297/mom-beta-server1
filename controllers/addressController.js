const Address = require('../models/Addres');
const User = require('../models/user.models')

// Create new address
const createAddress = async (req, res) => {
  try {
    const { userid, state, city, street, pincode, currentLocation } = req.body;

    const address = new Address({
      userid,
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

const makePrimaryAddress = async (req, res) => {
  const userId = req.user.id; // coming from userAuth middleware
  const addressId = req.params.id;

  try {
    // 1. Check if the address exists and belongs to the user
    const address = await Address.findOne({ _id: addressId, userid: userId });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found or unauthorized" });
    }

    // 2. Set all other addresses to isPrimary: false
    await Address.updateMany({ userid: userId }, { $set: { isPrimary: false } });

    // 3. Set selected address to isPrimary: true
    address.isPrimary = true;
    await address.save();

    // 4. Update user record with primary address ID
    await Users.findByIdAndUpdate(userId, { primaryAddress: addressId });

    res.status(200).json({
      success: true,
      message: "Primary address set successfully",
      address,
    });
  } catch (error) {
    console.error("Set Primary Address Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { userid, state, city, street, pincode, currentLocation } = req.body;

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      {
        userid,
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

const getAddressByUser = async  ()=>{
  const userId = req.userId 
  try{
     const addresses = await Address.find({userid:userId}) 
     res.status(200).json({data:addresses , status:true})
  }catch(e){
    res.status(500).json({message:"Internal sever error" , e})
  }
}

module.exports = {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress ,getAddressByUser,makePrimaryAddress
};
