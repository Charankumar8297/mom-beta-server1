const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/order.models');


const merchantKey = process.env.PAYU_MERCHANT_KEY;
const merchantSalt = process.env.PAYU_MERCHANT_SALT;

exports.verifyRazorpay = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { orderId },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'SUCCESS',
        }
      );

      await Order.findByIdAndUpdate(orderId, { status: 'paid' });

      return res.status(200).json({
        success: true,
        message: "Razorpay payment verified successfully",
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
    }
  } catch (err) {
    console.error("Razorpay Verification Error:", err);
    return res.status(500).json({ success: false, message: "Server error during Razorpay verification" });
  }
};


exports.verifyPayU = async (req, res) => {
  const {
    key, txnid, amount, productinfo, firstname, email, status,
    hash, mihpayid
  } = req.body;

  try {
    const reverseHashString =
      `${merchantSalt}|${status}||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

    const expectedHash = crypto
      .createHash('sha512')
      .update(reverseHashString)
      .digest('hex');

    if (expectedHash === hash) {
      await Payment.findOneAndUpdate(
        { txnid },
        {
          status: 'SUCCESS',
          mihpayid,
        }
      );

      const payment = await Payment.findOne({ txnid });
      if (payment?.orderId) {
        await Order.findByIdAndUpdate(payment.orderId, { status: 'paid' });
      }
    
      return res.status(200).json({ success: true, message: "PayU payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid PayU hash" });
    }
  } catch (err) {
    console.error("PayU Verification Error:", err);
    return res.status(500).json({ success: false, message: "Server error during PayU verification" });
  }
};