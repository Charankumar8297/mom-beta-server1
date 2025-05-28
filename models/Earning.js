const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  deliveryId:{
    type:String,
    required:true
  },
  orders:[
    {
      order_id: { type: String, required: true },
      base_earning: { type: Number, default: 20 },
      bonus: { type: Number, default: 0 },
      deduction: { type: Number, default: 0 },
      total_earning: { type: Number, default: 20 },
      ETA:{type:Number , default: 0},
      EarningStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  total_earning: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  cratedAt: {
    type: Date,
    default: Date.now
  },
})

earningSchema.pre('save', function(next) {
  this.total_earning = this.orders.reduce((acc, order) => acc + order.total_earning, 0);
  next();
}
);

const Earnings = mongoose.model('Earning', earningSchema);
module.exports = Earnings;