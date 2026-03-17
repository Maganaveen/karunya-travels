const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'wallet', 'upi'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'cash'],
    default: 'stripe'
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    receiptUrl: String
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  failureReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);