import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../assets/css/InvestorManage.css';
import { Link } from 'react-router-dom';

function InvestorManage() {
    const [investors, setInvestors] = useState([]);
    const [filteredInvestors, setFilteredInvestors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvestors();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, investors]);

    const fetchInvestors = async () => {
        const res = await axios.get('http://localhost:8000/investor/all');
        setInvestors(res.data);
    };

    const updateStatus = async (id, isApproved, isActive) => {
        await axios.patch(`http://localhost:8000/investor/status/${id}`, { isApproved, isActive });
        fetchInvestors();
    };

    const deleteInvestor = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this investor?");
        if (confirmDelete) {
            await axios.delete(`http://localhost:8000/investor/${id}`);
            fetchInvestors();
        }
    };

    const applyFilters = () => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = investors.filter(inv =>
            inv.name?.toLowerCase().includes(lowerSearch) ||
            inv.fname?.toLowerCase().includes(lowerSearch) ||
            inv.email?.toLowerCase().includes(lowerSearch) ||
            inv.categories?.toLowerCase().includes(lowerSearch)
        );
        setFilteredInvestors(filtered);
    };

    return (
        <div className="container my-5">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="card shadow-sm p-4 animated-card">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <h2 className="m-0">👤 Manage Investors</h2>
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
                                {filteredInvestors.map((inv, index) => (
                                    <motion.tr key={inv._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                        <td>{index + 1}</td>
                                        <td>{inv.name}</td>
                                        <td>{inv.fname}</td>
                                        <td>{inv.categories}</td>
                                        <td>{inv.email}</td>
                                        <td>
                                            <Link className="btn btn-outline-primary ms-3" to={`/Admin/investor-profile/${inv._id}`}>
                                                View
                                            </Link>
                                        </td>
                                        <td>
                                            <span className={` ${inv?.isApproved ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {inv?.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={` ${inv?.isActive ? 'bg-primary' : 'bg-secondary'}`}>
                                                {inv?.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button className="btn approve btn-sm animated-btn" onClick={() => updateStatus(inv._id, true, true)}>
                                                    Approve
                                                </button>
                                                <button className="btn btn-warning btn-sm animated-btn" onClick={() => updateStatus(inv._id, true, false)}>
                                                    Deactivate
                                                </button>
                                                <button className="btn btn-danger btn-sm animated-btn" onClick={() => deleteInvestor(inv._id)}>
                                                    Delete
                                                </button>
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

export default InvestorManage;
