import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ViewSelectedEntrepreneurs = () => {
  const [raisedPitches, setRaisedPitches] = useState([]);
  const [approvedPitches, setApprovedPitches] = useState([]);
  const [cancelledPitches, setCancelledPitches] = useState([]);
  const [activeTab, setActiveTab] = useState('raised');

  const investor = JSON.parse(localStorage.getItem('investor'));

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/investments/investor/${investor._id}`);
        const data = res.data;
        setRaisedPitches(data.filter(p => p.status === 'pending'));
        setApprovedPitches(data.filter(p => p.status === 'approved'));
        setCancelledPitches(data.filter(p => p.status === 'cancelled'));
      } catch (err) {
        console.error('Error fetching investments:', err);
      }
    };

    fetchInvestments();
  }, [investor._id]);

  const sectionVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const PitchCard = ({ pitch }) => (
    <motion.div
      layout
      className="card shadow-sm rounded-4 p-3 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h5 className="fw-bold">{pitch.pitchId?.title}</h5>
      <p className="text-muted">{pitch.pitchId?.description}</p>
      <div>💰 <strong>Fund:</strong> ₹{pitch.investAmount}</div>
      <div className="mt-2">📈 <strong>Equity Offer:</strong> {pitch.pitchId?.equity}%</div>
      <div className="mt-2">
  👤 <strong>Entrepreneur:</strong> {pitch.entrepreneurId?.name || 'N/A'}
</div>
      <div className="mt-3">
        {/* <Button variant="outline-primary" onClick={() => alert(`Show profile of ${pitch.entrepreneurName}`)}>
          View Profile
        </Button> */}
        <Link
          className="btn btn-outline-primary w-100"
          to={`/investor/entrepreneur-profile/${pitch.entrepreneurId}`}
        >
          👤 View Profile
        </Link>
      </div>
    </motion.div>
  );

  const renderPitches = (pitches) => (
    pitches.length > 0 ? (
      pitches.map(p => (
        <div key={p._id} className="col-md-6">
          <PitchCard pitch={p} />
        </div>
      ))
    ) : (
      <div className="text-center text-muted py-4">No {activeTab} pitches yet.</div>
    )
  );

  return (
    <div className="container my-5">
      <div className="text-center mb-4 d-flex gap-4 justify-content-around">
        <Button
          variant={activeTab === 'raised' ? ' text-white bg-warning' : 'outline-success'}
          className="px-4 py-2 fs-5  rounded-pill"
          onClick={() => setActiveTab('raised')}
        >
          📤 Pending Raised Requests
        </Button>
        <Button
          variant={activeTab === 'approved' ? 'success' : 'outline-success'}
          className="px-4 py-2 fs-5 rounded-pill"
          onClick={() => setActiveTab('approved')}
        >
          ✅ Approved
        </Button>
        <Button
          variant={activeTab === 'cancelled' ? ' text-white bg-danger' : 'outline-success'}
          className="px-4 py-2 fs-5 rounded-pill "
          onClick={() => setActiveTab('cancelled')}
        >
          ❌ Cancelled
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="row"
        >
          {activeTab === 'raised' && renderPitches(raisedPitches)}
          {activeTab === 'approved' && renderPitches(approvedPitches)}
          {activeTab === 'cancelled' && renderPitches(cancelledPitches)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ViewSelectedEntrepreneurs;
