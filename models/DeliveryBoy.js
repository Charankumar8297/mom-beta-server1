const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
  },
  AadharNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  pancardNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  storeId: {
    type: Number,
    required: true,
  },
  drivingLicense: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: false,  // optional email
    trim: true,
    lowercase: true,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Busy'],
    default: 'Online',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);
