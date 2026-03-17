const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Process payment
const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create payment record
    const payment = new Payment({
      bookingId,
      customerId: booking.customerId,
      amount,
      paymentMethod,
      paymentStatus: 'processing'
    });

    // Simulate payment processing
    if (paymentMethod === 'cash') {
      payment.paymentStatus = 'pending';
      payment.paymentGateway = 'cash';
    } else {
      // Simulate card payment success (90% success rate)
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        payment.paymentStatus = 'completed';
        payment.transactionId = `txn_${Date.now()}`;
        payment.paymentDetails = {
          cardLast4: '1234',
          cardBrand: 'Visa'
        };
        
        // Update booking payment status
        booking.paymentStatus = 'paid';
        await booking.save();
      } else {
        payment.paymentStatus = 'failed';
        payment.failureReason = 'Insufficient funds';
      }
    }

    await payment.save();
    res.json({ payment, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment details
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId')
      .populate('customerId', 'name email');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments by booking
const getPaymentsByBooking = async (req, res) => {
  try {
    const payments = await Payment.find({ bookingId: req.params.bookingId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getPayment,
  getPaymentsByBooking
};