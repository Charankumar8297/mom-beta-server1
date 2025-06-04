const mongoose = require('mongoose');

const storeAddressSchema = mongoose.Schema(
    {
        DoorNo: {
            type: String,
        },
        Street: {
            type: String,
        },
        Building: {
            type: String,
        },
        Pincode: {
            type: Number,
        },
        City: {
            type: String,
        },
        CurrentLocation: {
            latitude: {
              type: Number,
              required: false,
            },
            longitude: {
              type: Number,
              required: false,
            },
          },
        },
        {
          timestamps: true,
        }
);

module.exports = mongoose.model('StoreAddress', storeAddressSchema);