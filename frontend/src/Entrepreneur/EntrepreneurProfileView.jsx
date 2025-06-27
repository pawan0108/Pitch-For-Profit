import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/css/InvestorProfile.css"; // Reuse same CSS
import defaultImg from '../assets/img/admin/admin.png';
import { useParams } from "react-router-dom";

const EntrepreneurProfileView = () => {
    const [entrepreneur, setEntrepreneur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams(); // 👈 get entrepreneur ID from URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/entrepreneur/${id}`);
                setEntrepreneur(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);    

    if (loading) return <div className="loading-text">Loading...</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!entrepreneur) return <div className="error-text">Entrepreneur not found.</div>;

    if (!entrepreneur.isActive) {
        return (
            <div className="deactivated-message">
                Your Account is deactivated by Admin
            </div>
        );
    }


    return (
        <motion.div
            className="profile-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="profile-left">
                <div className="profile-image-wrapper">
                    <img src={entrepreneur.photo || defaultImg} alt="Profile" className="profile-image" />
                </div>
                <h1 className="investor-name">{entrepreneur.name}</h1>
                <h2 className="investor-role">Entrepreneur</h2>
                <div className="basic-info">
                    <p><strong>Gender:</strong> {entrepreneur.gender}</p>
                    <p><strong>Age:</strong> {entrepreneur.age || "N/A"}</p> 
                    <p><strong>Education:</strong> {entrepreneur.education || "N/A"}</p>
                    <p><strong>Address:</strong> {entrepreneur.address}</p>
                    <p><strong>Location:</strong> {entrepreneur.city}, {entrepreneur.state}, {entrepreneur.country}</p>
                </div>
            </div>

            <div className="profile-right">
                <InfoBox title="Firm Details">
                    <p><strong>Firm Name:</strong> {entrepreneur.fname}</p>
                    <p><strong>Firm Address:</strong> {entrepreneur.faddress}</p>
                </InfoBox>

                <InfoBox title="Contact Info">
                    <p><strong>Mobile:</strong> {entrepreneur.mobile}</p>
                    <p><strong>Email:</strong> {entrepreneur.email}</p>
                </InfoBox>

                <InfoBox title="Category">
                    <p>{entrepreneur.categories}</p>
                </InfoBox>

                <InfoBox title="Registered On">
                    <p>{entrepreneur.regdate ? new Date(entrepreneur.regdate).toLocaleDateString() : "N/A"}</p>
                </InfoBox>
            </div>
        </motion.div>
    );
};

const InfoBox = ({ title, children }) => (
    <motion.div className="info-box" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 150 }}>
        <h3>{title}</h3>
        {children}
    </motion.div>
);

export default EntrepreneurProfileView;
