import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../assets/css/SubscriptionModal.css';
// import React, { useState, useEffect } from 'react';

const SubscriptionModal = ({ show, handleClose, setSubscriptionStatus }) => {
  const [formData, setFormData] = useState({
    name: '',
    firmname: '',
    contactno: '',
    emailaddress: '',
    paidcno: '',
    paymentdate: ''
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      const screenshotInput = document.getElementById('screenshot');
      if (screenshotInput.files.length > 0) {
        form.append('screenshot', screenshotInput.files[0]);
      }

      const res = await fetch('http://localhost:8000/api/payment/manual-subscribe', {
        method: 'POST',
        body: form
      });

      const data = await res.json();

      if (res.ok) {
        alert('Payment request submitted successfully!');
        localStorage.setItem("subscriptionStatus", "pending");
setSubscriptionStatus("pending");

        handleClose();
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (err) {
      console.error('Error during form submission:', err);
      alert('Something went wrong. Please try again.');
    }
  };
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      setFormData((prev) => ({ ...prev, id: user._id }));
    }
  }, [show]);
  

  const PaymentMethodModal = () => (
    <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Payment Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="radio"
            label="By UPI"
            name="paymentMethod"
            id="upi"
            onChange={() => setSelectedMethod('upi')}
          />
          <Form.Check
            type="radio"
            label="By QR"
            name="paymentMethod"
            id="qr"
            onChange={() => setSelectedMethod('qr')}
          />
          <Form.Check
            type="radio"
            label="By Bank Account"
            name="paymentMethod"
            id="bank"
            onChange={() => setSelectedMethod('bank')}
          />

          <div className="mt-3">
            {selectedMethod === 'upi' && <p><strong>UPI ID:</strong> demo@upi</p>}
            {selectedMethod === 'qr' && <img src="/dummy-qr.png" alt="QR Code" width="100%" />}
            {selectedMethod === 'bank' && (
              <div>
                <p><strong>Bank Name:</strong> Demo Bank</p>
                <p><strong>Account Number:</strong> 123456789</p>
                <p><strong>IFSC Code:</strong> DEMO0001234</p>
              </div>
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => setShowPaymentModal(false)}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-subscription-modal">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-green d-flex justify-content-between w-100">
            Subscribe to Pitch For Profit
            <Button variant="outline-success" size="sm" onClick={() => setShowPaymentModal(true)}>
              Pay Here
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="subscription-form" onSubmit={handleSubmit}>
            {[ 'name', 'firmname', 'contactno', 'emailaddress', 'paidcno', 'paymentdate'].map((field, idx) => (
              <Form.Group className="mb-3" controlId={field} key={idx}>
                <Form.Control
                  type={field === 'paymentdate' ? 'date' : 'text'}
                  placeholder={
                    field === 'paidcno'
                      ? 'Transaction ID / Card Number'
                      : field === 'firmname'
                      ? 'Firm Name'
                      : field === 'contactno'
                      ? 'Contact Number'
                      : field === 'emailaddress'
                      ? 'Email Address'
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3" controlId="screenshot">
              <Form.Control type="file" accept="image/*" required />
            </Form.Group>

            <Button variant="success" type="submit" className="subscribe-button-green">
              Submit Payment Request
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <PaymentMethodModal />
    </>
  );
};

export default SubscriptionModal;
