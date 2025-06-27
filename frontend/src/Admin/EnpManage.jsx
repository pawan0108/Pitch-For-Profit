import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../assets/css/InvestorManage.css';
import { Link } from 'react-router-dom';

function EnpManage() {
    const [entrepreneurs, setEntrepreneurs] = useState([]);
    const [filteredEntrepreneurs, setFilteredEntrepreneurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEntrepreneurs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, entrepreneurs]);

    const fetchEntrepreneurs = async () => {
        const res = await axios.get('http://localhost:8000/entrepreneur/all');
        setEntrepreneurs(res.data);
    };

    const updateStatus = async (id, isApproved, isActive) => {
        await axios.patch(`http://localhost:8000/entrepreneur/status/${id}`, { isApproved, isActive });
        fetchEntrepreneurs();
    };

    const deleteEntrepreneur = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this entrepreneur?");
        if (confirmDelete) {
            await axios.delete(`http://localhost:8000/entrepreneur/${id}`);
            fetchEntrepreneurs();
        }
    };

    const applyFilters = () => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = entrepreneurs.filter(enp =>
            enp.name?.toLowerCase().includes(lowerSearch) ||
            enp.fname?.toLowerCase().includes(lowerSearch) ||
            enp.email?.toLowerCase().includes(lowerSearch) ||
            enp.categories?.toLowerCase().includes(lowerSearch)
        );
        setFilteredEntrepreneurs(filtered);
    };

    return (
        <div className="container my-5">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="card shadow-sm p-4 animated-card">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <h2 className="m-0">🧑‍💼 Manage Entrepreneurs</h2>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Name, Firm, Email, or Category"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-striped text-center align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>S.N.</th>
                                    <th>Name</th>
                                    <th>Firm Name</th>
                                    <th>Categories</th>
                                    <th>Email</th>
                                    <th>Profile</th>
                                    <th>Approval</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntrepreneurs.map((enp, index) => (
                                    <motion.tr key={enp._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                        <td>{index + 1}</td>
                                        <td>{enp.name}</td>
                                        <td>{enp.fname}</td>
                                        <td>{enp.categories}</td>
                                        <td>{enp.email}</td>
                                        <td>
                                            <Link className="btn btn-outline-primary ms-3" to={`/admin/entrepreneur-profile/${enp._id}`}>View</Link>
                                        </td>
                                        <td>
                                            <span className={` ${enp.isApproved ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {enp.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={` ${enp.isActive ? 'bg-primary' : 'bg-secondary'}`}>
                                                {enp.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button className="btn approve btn-sm animated-btn" onClick={() => updateStatus(enp._id, true, true)}>Approve</button>
                                                <button className="btn btn-warning btn-sm animated-btn" onClick={() => updateStatus(enp._id, true, false)}>Deactivate</button>
                                                <button className="btn btn-danger btn-sm animated-btn" onClick={() => deleteEntrepreneur(enp._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default EnpManage;
