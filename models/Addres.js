const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',  
      required: [true, "Please add the user ID"],
    },
    state: {
      type: String,
      required: [true, "Please add the state"],
    },
    city: {
      type: String,
      required: [true, "Please add the city"],
    },
    street: {
      type: String,
      required: [true, "Please add the street"],
    },
    pincode: {
      type: Number,
      required: [true, "Please add the pincode"],
    },
    currentLocation: {
      lattitude: {
        type: Number,
        required: false,
      },
      logitude: {
        type: Number,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Addres', addressSchema);
