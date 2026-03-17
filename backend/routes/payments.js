const express = require('express');
const router = express.Router();
const { processPayment, getPayment, getPaymentsByBooking } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Process payment
router.post('/process', auth, processPayment);

// Get payment details
router.get('/:id', auth, getPayment);

// Get payments by booking
router.get('/booking/:bookingId', auth, getPaymentsByBooking);

module.exports = router;