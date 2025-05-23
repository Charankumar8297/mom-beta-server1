const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
  delivery_agent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryBoy',
    required: true,
    unique: true
  },
  current_balance: { type: Number, default: 0 },
  total_earned: { type: Number, default: 0 },
  total_orders: { type: Number, default: 0 },
  last_withdraw_amount: { type: Number, default: 0 },
  last_withdraw_date: { type: Date },
  daily: {
    date: { type: Date },
    amount: { type: Number, default: 0 },
    orders: { type: Number, default: 0 }
  },
  weekly: {
    week_label: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    amount: { type: Number, default: 0 },
    orders: { type: Number, default: 0 }
  },
  monthly: {
    month: { type: String },
    amount: { type: Number, default: 0 },
    orders: { type: Number, default: 0 }
  },
  order_earnings: [{
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    date: { type: Date, required: true },
    base_earning: { type: Number, default: 20 },
    bonus: { type: Number, default: 0 },
    deduction: { type: Number, default: 0 },
    total_earning: { type: Number, default: 20 }
    
  }]
}, { timestamps: true });

module.exports = mongoose.model('Earning', EarningSchema);