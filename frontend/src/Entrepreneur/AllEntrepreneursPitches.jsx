import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const AllEntrepreneursPitches = () => {
    const [pitches, setPitches] = useState([]);
    const [selectedPitch, setSelectedPitch] = useState(null);
    const [investment, setInvestment] = useState({ amount: '', equity: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');


    const investor = JSON.parse(localStorage.getItem('investor'));

    useEffect(() => {
        const fetchPitchesWithRaiseCount = async () => {
            try {
                const res = await axios.get('http://localhost:8000/pitches');
                const pitchesData = res.data;

                // For each pitch, fetch its raiseCount from backend
                const enrichedPitches = await Promise.all(
                    pitchesData.map(async (pitch) => {
                        try {
                            const countRes = await axios.get(`http://localhost:8000/pitches/count/${pitch._id}`);
                            console.log('PITCH COUNT:', pitch._id, '=>', countRes.data.count); // ✅ Correct scope
                            return { ...pitch, raiseCount: countRes.data.count };
                        } catch (err) {
                            console.error('Error fetching count for pitch:', pitch._id, err);
                            return { ...pitch, raiseCount: 0 }; // fallback
                        }
                    })
                );

                setPitches(enrichedPitches);
            } catch (error) {
                console.error('Error fetching pitches:', error);
            }
        };

        fetchPitchesWithRaiseCount();
    }, []);

    // const fetchPitchesWithRaiseCount = async () => {
    //     try {
    //         const res = await axios.get('http://localhost:8000/pitches');
    //         const pitchesData = await Promise.all(
    //             res.data.map(async (pitch) => {
    //                 try {
    //                     const countRes = await axios.get(`http://localhost:8000/pitches/count/${pitch._id}`);
    //                     console.log('PITCH COUNT:', pitch._id, '=>', countRes.data.count); // ✅ Correct scope
    //                     return { ...pitch, raiseCount: countRes.data.count };
    //                 } catch (countErr) {
    //                     console.error('Error fetching raise count for pitch', pitch._id, countErr);
    //                     return { ...pitch, raiseCount: 0 };
    //                 }
    //             })
    //         );
    //         setPitches(pitchesData);
    //     } catch (err) {
    //         console.error('Error fetching pitches:', err);
    //     }
    // };


    //   Filter
    const filteredPitches = pitches.filter(pitch => {
        const matchCategory = filterCategory === 'All' || pitch.category === filterCategory;
        const amount = Number(pitch.fund);
        const matchMin = minAmount === '' || amount >= Number(minAmount);
        const matchMax = maxAmount === '' || amount <= Number(maxAmount);
        return matchCategory && matchMin && matchMax;
    });


    const openModal = (pitch) => {
        setSelectedPitch(pitch);
        setInvestment({ amount: '', equity: '' });
        setErrorMsg('');
    };


    const handleInvestSubmit = async () => {
        if (!selectedPitch || !investor) return;

        if (!investment.amount || !investment.equity) {
            setErrorMsg('⚠️ Please enter both amount and equity.');
            return;
        }

        const payload = {
            pitchId: selectedPitch._id,
            entrepreneurId: selectedPitch.entrepreneurId,
            investorId: investor._id,
            investAmount: investment.amount,
            equity: investment.equity,
        };

        try {
            setLoading(true);
            await axios.post('http://localhost:8000/investments', payload);
            alert('✅ Investment submitted successfully!');
            setSelectedPitch(null); // Close modal
            setErrorMsg('');
            // Optional: update raise count locally
            setPitches(prev =>
                prev.map(p =>
                    p._id === selectedPitch._id ? { ...p, raiseCount: (p.raiseCount || 0) + 1 } : p
                )
            );
        } catch (error) {
            console.error('Investment error:', error);
            const msg = error?.response?.data?.error || '❌ Investment submission failed.';
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };


    const handleProfileView = (entrepreneurId) => {
        window.location.href = `/entrepreneur-profile/${entrepreneurId}`;
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">🚀 All Entrepreneurs' Pitches</h2>
            <div className="mb-4 row justify-content-center align-items-end g-3">
                <div className="col-md-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {[...new Set(pitches.map(p => p.category))].map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="form-label">Min Amount (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                    />
                </div>

                <div className="col-md-2">
                    <label className="form-label">Max Amount (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                    />
                </div>
            </div>

            <div className="row g-4">
                {filteredPitches.map((pitch, idx) => (
                    <motion.div
                        key={pitch._id}
                        className="col-md-6"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                        <div className="card shadow h-100 border-0 rounded-4">
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{pitch.title}</h5>
                                <p className="text-muted">{pitch.description}</p>
                                <div className="mb-2">
                                    <span className="badge bg-primary w-25 fs-5 ">{pitch.category}</span>
                                </div>
                                <div className="mb-2">💰 <strong>Funding:</strong> ₹{pitch.fund}</div>
                                <div className="mb-2">📈 <strong>Equity Offered:</strong> {pitch.equity}%</div>
                                <div className="mb-2">👥 <strong>Investors Raised:</strong> {pitch.raiseCount || 0}</div>

                                {pitch.filePath && (
                                    <div className="mt-2">
                                        📎 <a href={`http://localhost:8000/${pitch.filePath}`} target="_blank" rel="noopener noreferrer">
                                            View Pitch File
                                        </a>
                                    </div>
                                )}

                                <div className="text-muted small mt-2">
                                    Pitch ID: <code>{pitch._id}</code><br />
                                    Entrepreneur ID: <code>{pitch.entrepreneurId}</code>
                                </div>

                                <div className="mt-3 d-flex justify-content-between">
                                    <button className="btn btn-outline-success " onClick={() => openModal(pitch)}>💸 Raise</button>
                                    <Link
                                        className="btn btn-outline-primary ms-3 w-100"
                                        to={`/investor/entrepreneur-profile/${pitch.entrepreneurId}`}
                                    >
                                        👤 View Profile
                                    </Link>

                                    {/* <button className="btn btn-outline-primary btn-sm" onClick={() => handleProfileView(pitch.entrepreneurId)}>👤 View Profile</button> */}
                                </div>
                            </div>
                            <div className="card-footer text-end text-muted small bg-light border-0">
                                📅 Submitted on: {new Date(pitch.submittedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Investment Modal */}
            <Modal show={!!selectedPitch} onHide={() => setSelectedPitch(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>💰 Invest in Pitch</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPitch && (
                        <>
                            <p><strong>Pitch ID:</strong> {selectedPitch._id}</p>
                            <p><strong>Entrepreneur ID:</strong> {selectedPitch.entrepreneurId}</p>
                            <p><strong>Investor ID:</strong> {investor?._id}</p>

                            <Form.Group className="mb-3">
                                <Form.Label>Investment Amount (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={investment.amount}
                                    onChange={(e) => setInvestment({ ...investment, amount: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Equity (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={investment.equity}
                                    onChange={(e) => setInvestment({ ...investment, equity: e.target.value })}
                                />
                            </Form.Group>

                            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedPitch(null)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={handleInvestSubmit} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Investment'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default AllEntrepreneursPitches;
