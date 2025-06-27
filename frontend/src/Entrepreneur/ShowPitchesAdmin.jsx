import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ShowPitchesAdmin = () => {
    const [pitches, setPitches] = useState([]);

    useEffect(() => {
        const fetchPitches = async () => {
            try {
                const res = await axios.get('http://localhost:8000/pitches');
                const pitchesWithCounts = await Promise.all(
                    res.data.map(async (pitch) => {
                        const countRes = await axios.get(`http://localhost:8000/pitches/count/${pitch._id}`);
                        return { ...pitch, raiseCount: countRes.data.count };
                    })
                );
                setPitches(pitchesWithCounts);
            } catch (err) {
                console.error('Error fetching pitches:', err);
            }
        };

        fetchPitches();
    }, []);

    const handleProfileClick = (entrepreneurId) => {
        window.location.href = `/entrepreneur-profile/${entrepreneurId}`;
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">📊 All Pitches (Admin View)</h2>

            <div className="row g-4">
                {pitches.length > 0 ? (
                    pitches.map((pitch, index) => (
                        <motion.div
                            key={pitch._id}
                            className="col-md-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="card border-0 shadow rounded-4 h-100">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{pitch.title}</h5>
                                    <p className="card-text">{pitch.description}</p>
                                    <span className="badge fs-4 bg-info text-dark mb-2">{pitch.category}</span>
                                    <p><strong>Fund Requested:</strong> ₹{pitch.fund}</p>
                                    <p><strong>Equity Offered:</strong> {pitch.equity}%</p>
                                    <p><strong>Investors Interested:</strong> {pitch.raiseCount}</p>
                                    {pitch.filePath && (
                                        <p><a href={`http://localhost:8000/${pitch.filePath}`} target="_blank" rel="noopener noreferrer">📄 View Pitch File</a></p>
                                    )}
                                    <Link
                                        className="btn btn-outline-primary w-100"
                                        to={`/investor/entrepreneur-profile/${pitch.entrepreneurId}`}
                                    >
                                        👤 View Profile
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center">
                        <p className="text-muted">No pitches found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowPitchesAdmin;
