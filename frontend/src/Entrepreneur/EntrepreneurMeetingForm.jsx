import React, { useState, useEffect } from 'react';


export default function EntrepreneurMeetingForm() {
  const [form, setForm] = useState({
    entrepreneurid: '',
    enpname: '',
    enpcontactno: '',
    enpemailaddress: '',
    investorid: '',
    investorname: '',
    investoremailaddress: '',
    meetingdate: '',
    meetingtime: '',
  });

  const [requests, setRequests] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInvestors, setFilteredInvestors] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q) {
      setFilteredInvestors([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/investor/search?q=${encodeURIComponent(q)}`);

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setFilteredInvestors(data);
    } catch (err) {
      console.error('Error fetching investors:', err);
    }
  };

  const selectInvestor = (inv) => {
    setForm({
      ...form,
      investorid: inv._id,
      investorname: inv.name,
      investoremailaddress: inv.email
    });
    setSearchQuery(`${inv.name} (${inv.categories || 'Unknown'})`);
    setFilteredInvestors([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/meeting-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setRequestSent(true);
        setForm({
          entrepreneurid: form.entrepreneurid,
          enpname: '',
          enpcontactno: '',
          enpemailaddress: '',
          investorid: '',
          investorname: '',
          investoremailaddress: '',
          meetingdate: '',
          meetingtime: '',
        });
        setSearchQuery('');
        fetchRequests();
        setTimeout(() => setRequestSent(false), 3000);
      }
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };

  const fetchRequests = async () => {
    if (!form.enpemailaddress) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/meeting-requests?enpemailaddress=${encodeURIComponent(form.enpemailaddress)}`
      );
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  // useEffect(() => {
  //   fetchRequests();
  // }, [form.enpemailaddress]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('entrepreneur'));
    if (data) {
      setForm(f => ({ ...f,entrepreneurid: data._id, enpname: data.name, enpcontactno: data.contact, enpemailaddress: data.email }));
    }
  }, []);
  

  const getStatusBadgeClass = status => {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'approved': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const handleJoin = (link, password) => {
    const input = prompt("Enter meeting password:");
    if (input === password) {
      window.open(link, '_blank');
    } else {
      alert("Incorrect password. Please try again.");
    }
  };
  
  return (
    <div className="container py-5" style={{ backgroundColor: "#f0fff0" }}>
      <h2 className="text-success text-center mb-4">Request a Meeting</h2>
      <form className="p-4 rounded shadow mb-4" onSubmit={handleSubmit} style={{ backgroundColor: "#dfffd6" }}>
        <h5 className="text-secondary">Entrepreneur Information</h5>
        <div className="row mb-2">
          <div className="col-md-4">
            <input type="text" className="form-control" name="enpname" placeholder="Your Name"
              value={form.enpname} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control" name="enpcontactno" placeholder="Contact Number"
              value={form.enpcontactno} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="email" className="form-control" name="enpemailaddress" placeholder="Email Address"
              value={form.enpemailaddress} onChange={handleChange} required />
          </div>
        </div>

        <h5 className="text-secondary">Search Investor</h5>
        <div className="mb-3 position-relative">
          <input type="text" className="form-control" placeholder="Search by name, email, phone or category"
            value={searchQuery} onChange={handleSearch} />
          {filteredInvestors.length > 0 && (
            <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {filteredInvestors.map((inv, i) => (
                <li key={i} className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }} onClick={() => selectInvestor(inv)}>
                  {inv.name} ({inv.email}) - {inv.categories}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h5 className="text-secondary">Preferred Date & Time</h5>
        <div className="row mb-3">
          <div className="col-md-6">
            <input type="date" className="form-control" name="meetingdate"
              value={form.meetingdate} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input type="time" className="form-control" name="meetingtime"
              value={form.meetingtime} onChange={handleChange} required />
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-5">Send Request</button>
        </div>
      </form>

      {requestSent && (
        <div className="alert alert-success text-center">Your meeting request has been sent!</div>
      )}

      <h5 className="text-secondary mt-4">Your Meeting Requests</h5>
      <div className="list-group">
        {requests.length === 0 && <div className="text-muted">No requests yet.</div>}
        {requests.map((r, i) => (
          <div key={i} className="list-group-item" style={{ backgroundColor: "#eeeeee" }}>
            <strong>{r.investorname}</strong> ({r.investoremailaddress})<br />
            Date: {r.meetingdate} | Time: {r.meetingtime}<br />
            <span className={`badge ${getStatusBadgeClass(r.status)} mt-1`}>
              Status: {r.status}
            </span>
            {r.status === 'approved' && r.meetinglink && (
              <div className="mt-2">
                <p className="mb-1">
                  <strong>Meeting ID:</strong> {r.meetingid}<br />
                  <strong>Meeting Link:</strong> <span className="text-muted">{r.meetinglink}</span><br />
                </p>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => handleJoin(r.meetinglink, r.meetingpassword)}
                >
                  Join Meeting
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}