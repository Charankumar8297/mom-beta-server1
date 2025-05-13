const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryboy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', default: null },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Addres' },

  status: {
    type: String,
    enum: ['confirmed', 'on the way', 'delivered', 'cancelled'],
    default: 'confirmed',
  },

  ETA: { type : Number, default: 10 },

  medicines: [{
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],

  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },     // renamed from deliveryFee
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true }, // final amount: subtotal + shipping + tax - discount

  paymentMethod: { type: String, enum: ['COD', 'TNPL'], default: 'COD' },

  isActive: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
