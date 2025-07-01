const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryboy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', default: null },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Addres' },

  status: {
    type: String,
  
    enum: ['confirmed','accepted', 'on the way', 'delivered', 'cancelled'],
    default: 'confirmed',
  },
    totalOrders : {type:Number , default:0 },

  ETA: { type : Number, default: 10 },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  medicines: [{
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    name:{type:String , required:true},
    imageUrl:{type:String , required:true},
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],

  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },     
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true }, 

  paymentMethod: { type: String, enum: ['COD', 'RAZORPAY','PAYU'], default: 'COD' },
  payment_id: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  tipAmount: {
  type: Number,
  default: 0,
},


  isActive: { type: Boolean, default: true },


}, 
{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);