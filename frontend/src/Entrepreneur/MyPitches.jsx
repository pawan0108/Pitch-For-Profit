import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyPitches = () => {
  const [activeTab, setActiveTab] = useState('pitches'); // 'pitches' or 'investors'
  const [investorView, setInvestorView] = useState('pending'); // 'pending', 'approved', 'cancelled'
  const [pitches, setPitches] = useState([]);
  const [investorMap, setInvestorMap] = useState({}); // pitchId -> [investors]

  const user = JSON.parse(localStorage.getItem("entrepreneur"));

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/pitches/user/${user._id}`);
      setPitches(res.data);

      const allInvestorData = {};
      for (const pitch of res.data) {
        const investorRes = await axios.get(`http://localhost:8000/investments/pitch/${pitch._id}`);
        allInvestorData[pitch._id] = investorRes.data;
      }
      setInvestorMap(allInvestorData);
    } catch (error) {
      console.error("Error fetching pitches or investors:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (investmentId) => {
    await axios.put(`http://localhost:8000/investments/accept/${investmentId}`);
    fetchData();
  };

  const handleCancel = async (investmentId) => {
    await axios.delete(`http://localhost:8000/investments/${investmentId}`);
    fetchData();
  };


  const handleDeletePitch = async (pitchId) => {
    if (window.confirm("Are you sure you want to delete this pitch?")) {
      try {
        await axios.delete(`http://localhost:8000/pitches/${pitchId}`);
        fetchData(); // Refresh data
      } catch (err) {
        console.error("Error deleting pitch:", err);
      }
    }
  };

  return (
    <div className="container my-5">
      {/* Top Tabs */}
      <div className="d-flex mb-4">
        <Button
          style={{ backgroundColor: '#28a745', border: 'none' }}
          onClick={() => setActiveTab('pitches')}
          className={`me-2 ${activeTab === 'pitches' ? 'fw-bold' : ''}`}
        >
          📊 My Pitches
        </Button>
        <Button
          style={{ backgroundColor: '#28a745', border: 'none' }}
          onClick={() => setActiveTab('investors')}
          className={activeTab === 'investors' ? 'fw-bold' : ''}
        >
          🧑‍💼 Raised Investors
        </Button>
      </div>

      {/* My Pitches Section */}
      {activeTab === 'pitches' && (
        <>
          <h2 className="text-center mb-4">📊 My Pitches</h2>
          <div className="row g-4">
            {pitches.map((pitch, idx) => (
              <motion.div
                key={pitch._id}
                className="col-md-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="card pitch-card shadow-lg h-100 border-0 rounded-4" style={{ backgroundColor: "#f0f8ff" }}>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{pitch.title}</h5>
                    <p className="card-text text-muted">{pitch.description}</p>
                    <span className="badge bg-primary fs-6 mb-2">{pitch.category}</span>
                    <p>💰 <strong>Funding:</strong> ₹{pitch.fund}</p>
                    <p>📈 <strong>Equity Offered:</strong> {pitch.equity}%</p>
                    {pitch.filePath && (
                      <div>
                        📎 <a href={`http://localhost:8000/${pitch.filePath}`} target="_blank" rel="noopener noreferrer">
                          View Pitch File
                        </a>
                      </div>
                    )}
                    <div className="text-muted small mt-2">
                      Entrepreneur ID: <code>{pitch.entrepreneurId}</code>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Button
                        variant="danger"
                        size="sm"
                        className="mt-3"
                        onClick={() => handleDeletePitch(pitch._id)}
                      >
                        🗑️ Delete
                      </Button>

                    </div>
                    <div className="card-footer text-end text-muted bg-light border-0">
                      📅 Submitted on: {new Date(pitch.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Raised Investors Section */}
      {activeTab === 'investors' && (
        <>
          <h2 className="text-center mb-4">🧑‍💼 Raised Investors</h2>

          {/* Sub-tabs: Pending | Approved | Cancelled */}
          <div className="d-flex justify-content-center mb-3 gap-2">
            {['pending', 'approved', 'cancelled'].map((tab) => (
              <Button
                key={tab}
                size="sm"
                onClick={() => setInvestorView(tab)}
                style={{
                  backgroundColor: investorView === tab ? '#28a745' : '#e0e0e0',
                  color: investorView === tab ? 'white' : 'black',
                  fontWeight: investorView === tab ? 'bold' : 'normal',
                  minWidth: '120px',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          {/* Cards Per Pitch */}
          {pitches.map((pitch, idx) => {
            const investors = investorMap[pitch._id] || [];
            const filteredInvestors = investors.filter(inv => {
              if (investorView === 'pending') return inv.status === 'pending';
              if (investorView === 'approved') return inv.status === 'approved';
              if (investorView === 'cancelled') return inv.status === 'cancelled';
              return true;
            });

            return (
              <motion.div
                key={pitch._id}
                className="mb-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="card shadow-sm p-3 rounded" style={{ backgroundColor: "#e9f7ef" }}>
                  <h5 className="fw-bold">{pitch.title}</h5>
                  <p className="text-muted">{pitch.description}</p>
                  {filteredInvestors.length === 0 ? (
                    <p className="text-muted">No {investorView} investors for this pitch.</p>
                  ) : (
                    filteredInvestors.map((investor) => (
                      <div key={investor._id} className="border p-3 mb-3 rounded bg-white">
                        <p><strong>👤 {investor.investorId?.name}</strong> ({investor.investorId?.email})</p>
                        <p>💰 ₹{investor.investAmount} | 📈 {investor.equity}%</p>
                        <div className="d-flex gap-2 justify-content-center">
                          {investor.status === 'pending' && (
                            <>
                              <Button size="sm" style={{ height: '50px' , width:"30%" }} variant="success" onClick={() => handleAccept(investor._id)}>✅ Accept</Button>
                              <Button size="sm" className='ms-3' style={{ height: '50px' , width:"30%" }} variant="danger" onClick={() => handleCancel(investor._id)}>❌ Cancel</Button>
                            </>
                          )}
                          <Link to={`/entrepreneur/investor-profile/${investor.investorId?._id}`} className="btn btn-outline-primary btn-sm py-2 fs-5 ms-3" style={{ height: '50px', width:"30%" }}>
                            🧑 View Profile
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default MyPitches;
