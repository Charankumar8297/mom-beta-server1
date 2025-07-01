const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  method: {
    type: String,
    enum: ["COD", "RAZORPAY", "PAYU"],
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  // Razorpay fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  // PayU fields
  payuTransactionId: String, 
  payuStatus: String,
  txnid: String,
  mode: String,
  bank_ref_num: String,
  addedon: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);