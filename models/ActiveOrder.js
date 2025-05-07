const mongoose = require('mongoose');

const ActiveOrderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'  
    }
  ],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActiveOrder', ActiveOrderSchema);

