import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InvestorMeeting() {
  const [requests, setRequests] = useState([]);
  const [investorId, setInvestorId] = useState(null);

  const fetchRequests = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/meeting-requests-for-investor?investorid=${id}`);
      console.log("Fetched requests:", res.data);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch meeting requests", err);
      setRequests([]);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      const res = await fetch(`http://localhost:8000/api/meeting-request/${id}/${decision}`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchRequests(investorId); // Refresh using stored ID
      }
    } catch (err) {
      console.error('Error updating meeting status:', err);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-warning text-dark';
    }
  };

  useEffect(() => {
    const storedInvestor = JSON.parse(localStorage.getItem('investor'));
    console.log("Investor from localStorage:", storedInvestor);
  
    const id = storedInvestor?._id || storedInvestor?.id; // handle both cases
  
    if (id) {
      setInvestorId(id);
      fetchRequests(id);
    } else {
      console.error("Investor ID not found in localStorage");
    }
  }, []);
  

  return (
    <div className="container py-5" style={{ backgroundColor: '#f0fff0' }}>
      <h2 className="text-success text-center mb-4">Investor Meeting Requests</h2>

      {requests.length === 0 ? (
        <p className="text-center text-muted">No meeting requests found.</p>
      ) : (
        <div className="list-group">
          {requests.map((req, i) => (
            <div key={i} className="list-group-item mb-3" style={{ backgroundColor: '#eeeeee' }}>
              <div className="mb-2">
                <strong>{req.enpname}</strong><br />
                ({req.enpemailaddress})<br />
                Date: {req.meetingdate} | Time: {req.meetingtime}<br />
                <span className={`badge ${getBadgeClass(req.status)} mt-1`}>
                  Status: {req.status}
                </span>
              </div>

              {req.status === 'pending' && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleDecision(req._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDecision(req._id, 'cancel')}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {req.status === 'approved' && req.meetinglink && (
                <div className="mt-2">
                  <p className="mb-1">
                    <strong>Meeting ID:</strong> {req.meetingid}<br />
                    <strong>Meeting Link:</strong>{' '}
                    <a href={req.meetinglink} target="_blank" rel="noopener noreferrer">
                      {req.meetinglink}
                    </a><br />
                    <strong>Password:</strong> {req.meetingpassword || 'N/A'}
                  </p>
                  <a
                    href={req.meetinglink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
