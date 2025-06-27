import React from 'react';

const PaymentComponent = () => {
  const handlePayment = async () => {
    const response = await fetch('http://localhost:8000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 500, email: 'user@example.com' }) // ₹500
    });

    const data = await response.json();

    const options = {
      key: 'YOUR_KEY_ID', // From Razorpay Dashboard
      amount: data.amount,
      currency: data.currency,
      name: 'Your App Name',
      description: 'Subscription Payment',
      order_id: data.orderId,
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // You can now update your backend (e.g. set subscribed: true)
      },
      prefill: {
        email: 'user@example.com'
      },
      theme: {
        color: '#0f9d58'
      },
      method: {
        upi: true // Allow UPI payments (PhonePe, GPay, etc.)
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment} className="btn btn-success">Pay ₹500</button>;
};

export default PaymentComponent;
