const mongoose = require('mongoose');

const DeliveryBoySchema = new mongoose.Schema({
 name: {
    type: String,
   //  required: true,
   // trim: true,
  },
  mobileNumber: {
    type: String,
   // required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
  },
  AadharNumber: {
    type: Number,
  },
  pancardNumber: {
    type: String,
  },
  storeId: {
    type: Number,
  },
  drivingLicense: {
    type: String,
  },
  isRegistered:{
    type: Boolean,
    default: false
}, 
status: {
    type: String,
    enum: ['Online', 'Offline', 'Busy'],
    default: 'Online'
  },
},
 {
  timestamps: true 
});

module.exports = mongoose.model('DeliveryBoy', DeliveryBoySchema);