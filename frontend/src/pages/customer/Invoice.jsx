import React from 'react';
import './Invoice.css';

const Invoice = ({ user, selectedCar, journeyDetails, paymentMethod, advanceAmount, onClose, onDownload }) => {
  const pricePerKm = 12;
  const distanceCharge = journeyDetails.distance * pricePerKm;
  const subtotal = distanceCharge;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const invoiceNumber = `INV-${Date.now()}`;
  const date = new Date().toLocaleDateString();

  return (
    <div className="invoice-overlay" onClick={onClose}>
      <div id="invoice-content" className="invoice-container" onClick={(e) => e.stopPropagation()}>
        {/* Invoice Header */}
        <div className="invoice-header">
          <h1>CAR RENTAL INVOICE</h1>
          <p>Invoice #{invoiceNumber}</p>
          <p>Date: {date}</p>
        </div>

        {/* Customer & Journey Details */}
        <div className="invoice-details-grid">
          <div>
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>
          <div>
            <h3>Journey Details</h3>
            <p><strong>From:</strong> {journeyDetails.homeCity}</p>
            <p><strong>To:</strong> {journeyDetails.placesToVisit.join(', ')}</p>
            <p><strong>Date:</strong> {new Date(journeyDetails.journeyDate).toLocaleDateString()}</p>
            <p><strong>Duration:</strong> {journeyDetails.days} Day(s)</p>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="invoice-section">
          <h3>Vehicle Details</h3>
          <div className="invoice-details-grid">
            <p><strong>Car:</strong> {selectedCar.make} {selectedCar.model}</p>
            <p><strong>Fuel Type:</strong> {selectedCar.fuelType}</p>
            <p><strong>Capacity:</strong> {selectedCar.capacity} Seats</p>
            <p><strong>Registration:</strong> {selectedCar.registrationNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="invoice-section">
          <h3>Pricing Breakdown</h3>
          <table className="invoice-table">
            <tbody>
              <tr>
                <td>Distance Charge ({journeyDetails.distance} km × ₹{pricePerKm}/km)</td>
                <td className="amount">₹{distanceCharge}</td>
              </tr>
              <tr className="subtotal-row">
                <td>Subtotal</td>
                <td className="amount">₹{subtotal}</td>
              </tr>
              <tr className="subtotal-row">
                <td>GST (18%)</td>
                <td className="amount">₹{tax}</td>
              </tr>
              <tr className="total-row">
                <td>TOTAL AMOUNT</td>
                <td className="amount">₹{total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Info */}
        <div className="invoice-payment">
          <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
          <p><strong>Payment Status:</strong> {paymentMethod === 'cash' ? 'Pending' : 'Paid'}</p>
          {advanceAmount && <p><strong>Advance Paid:</strong> ₹{advanceAmount}</p>}
        </div>

        {/* Terms */}
        <div className="invoice-terms">
          <p><strong>Terms & Conditions:</strong></p>
          <ul>
            <li>Driver must have a valid driving license</li>
            <li>Fuel charges included in rental</li>
            <li>Toll charges are extra</li>
            <li>Security deposit may be required</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="invoice-actions no-print">
          <button onClick={onDownload} className="btn-download">
            <i className="fas fa-download"></i> Download PDF
          </button>
          <button onClick={onClose} className="btn-close">
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
