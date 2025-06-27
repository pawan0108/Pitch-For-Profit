import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';

const AdminPaymentApproval = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/payment/all');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      setFeedback('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve button handler
  const approve = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/payment/manual-subscribe/${id}/approve`);
      setFeedback('Payment approved');
      fetchPayments();
    } catch (err) {
      console.error(err);
      setFeedback('Error approving payment');
    }
  };

  // ✅ Cancel button handler (set status back to Pending)
  const cancel = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/payment/update-status/${id}`, {
        paymentstatus: 'Pending'
      });
      setFeedback('Payment set to Pending');
      fetchPayments();
    } catch (err) {
      console.error(err);
      setFeedback('Error canceling payment');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Payment Requests</h2>
      {feedback && <Alert variant="info">{feedback}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Firm</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Payment Date</th>
            <th>Screenshot</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.firmname}</td>
              <td>{p.contactno}</td>
              <td>{p.emailaddress}</td>
              <td>{p.paidcno}</td>
              <td>{p.paymentstatus}</td>
              <td>{new Date(p.paymentdate).toLocaleDateString()}</td>
              <td>
                {p.screenshot ? (
                  <a
                    href={`http://localhost:8000/${p.screenshot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : 'No Screenshot'}
              </td>
              <td>
                <Button variant="success" size="sm" onClick={() => approve(p._id)}>Approve</Button>
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => cancel(p._id)}>Cancel</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPaymentApproval;
