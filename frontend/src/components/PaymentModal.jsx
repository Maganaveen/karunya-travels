import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: booking._id,
          paymentMethod,
          amount: booking.totalAmount
        })
      });

      const data = await response.json();

      if (data.payment.paymentStatus === 'completed') {
        toast.success('Payment successful!');
        onPaymentSuccess(data);
      } else if (data.payment.paymentStatus === 'failed') {
        toast.error(data.payment.failureReason || 'Payment failed');
      } else {
        toast.info('Payment is being processed');
        onPaymentSuccess(data);
      }
    } catch (error) {
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Payment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <h6>Booking Details</h6>
              <p>Amount: ₹{booking.totalAmount}</p>
              <p>Distance: {booking.totalDistance} km</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <div className="d-flex gap-2">
                <button
                  className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  Card
                </button>
                <button
                  className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  Cash
                </button>
                <button
                  className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  UPI
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? 'Processing...' : `Pay ₹${booking.totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;