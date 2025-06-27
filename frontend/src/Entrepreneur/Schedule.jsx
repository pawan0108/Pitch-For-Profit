import React, { useEffect, useState } from 'react';

export default function Schedule() {
  const [allMeetings, setAllMeetings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [entrepreneurEmail, setEntrepreneurEmail] = useState('');

  useEffect(() => {
    const storedEntrepreneur = JSON.parse(localStorage.getItem('entrepreneur'));
    if (storedEntrepreneur?.email) {
      setEntrepreneurEmail(storedEntrepreneur.email);
    }
  }, []);

  useEffect(() => {
    if (entrepreneurEmail) {
      fetchMeetings(entrepreneurEmail);
    }
  }, [entrepreneurEmail]);

  const fetchMeetings = async (email) => {
    try {
      const url = `http://localhost:8000/api/meeting-requests?enpemailaddress=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      const data = await res.json();
      const sorted = [...data].sort((a, b) => new Date(b.meetingdate) - new Date(a.meetingdate));
      setAllMeetings(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    }
  };

  useEffect(() => {
    filterMeetings();
  }, [statusFilter, searchQuery, allMeetings]);

  const filterMeetings = () => {
    let result = [...allMeetings];

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.enpname?.toLowerCase().includes(q) ||
        m.investorname?.toLowerCase().includes(q) ||
        m.enpemailaddress?.toLowerCase().includes(q) ||
        m.investoremailaddress?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const getStatusBadgeClass = status => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      case 'pending': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/meeting-request/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      const updatedMeetings = allMeetings.filter(m => m._id !== id);
      setAllMeetings(updatedMeetings);
      setFiltered(updatedMeetings);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete meeting');
    }
  };


  return (
    <div className="container py-5" style={{ backgroundColor: '#f0fff0' }}>
      <h2 className="text-success text-center mb-4">Your Scheduled Meetings</h2>

      <input
        className="form-control mb-3"
        placeholder="Search by entrepreneur/investor/email"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <div className="d-flex justify-content-center mb-4 gap-2">
        {['all', 'approved', 'pending', 'cancelled'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="list-group">
        {paginatedData.length === 0 && <div className="text-muted">No meetings found.</div>}
        {paginatedData.map((r, i) => (
          <div key={i} className="list-group-item mb-2" style={{ backgroundColor: '#eeeeee' }}>
            <strong>Entrepreneur:</strong> {r.enpname} ({r.enpemailaddress})<br />
            <strong>Investor:</strong> {r.investorname} ({r.investoremailaddress})<br />
            <strong>Date:</strong> {r.meetingdate} | <strong>Time:</strong> {r.meetingtime}<br />
            <span className={`badge fs-5 ${getStatusBadgeClass(r.status)} mt-1`}>
              Status: {r.status}
            </span>
            <button
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => handleDeleteMeeting(r._id)}
            >
              Delete
            </button>
            {r.status === 'approved' && r.meetinglink && (
              <div className="mt-2">
                <p className="mb-1">
                  <strong>Meeting ID:</strong> {r.meetingid}<br />
                  <strong>Link:</strong>{' '}
                  <a href={r.meetinglink} target="_blank" rel="noopener noreferrer">
                    {r.meetinglink}
                  </a><br />
                  <strong>Password:</strong> {r.meetingpassword || 'N/A'}
                </p>
                <a
                  href={r.meetinglink}
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

      {totalPages > 1 && (
        <div className="mt-4 d-flex justify-content-center align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>

          <span className="badge bg-light text-dark border px-3 py-2 shadow-sm">
            <strong>Page {currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
