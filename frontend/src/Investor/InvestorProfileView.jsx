import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/css/InvestorProfile.css";
import admin from "../assets/img/admin/admin.png";

const InvestorProfileView = () => {
    const [investor, setInvestor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvestorData = async () => {
            try {
                const storedInvestor = JSON.parse(localStorage.getItem("investor"));
                if (storedInvestor) {
                    const id = storedInvestor._id || storedInvestor.id;
                    const res = await axios.get(`http://localhost:8000/investor/${id}`);
                    setInvestor(res.data);
                    localStorage.setItem("investor", JSON.stringify(res.data));
                } else {
                    setError("No investor data found in local storage.");
                }
            } catch (err) {
                console.error("Error fetching investor:", err);
                setError("Failed to fetch investor details.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvestorData();
    }, []);

    if (loading) return <div className="loading-text">Loading...</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!investor) return <div className="error-text">Investor not found.</div>;

    if (investor.isActive === false) {
        return (
            <div className="deactivated-message" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textAlign: "center",
                color: "red"
            }}>
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
                    <img
                        src={investor.photo || admin}
                        alt="Profile"
                        className="profile-image"
                    />
                </div>
                <h1 className="investor-name">{investor.name || "Investor"}</h1>
                <h2 className="investor-role">{investor.role || "Investor"}</h2>

                <div className="basic-info">
                    <p><strong>Gender:</strong> {investor.gender || "N/A"}</p>
                    <p><strong>Age:</strong> {investor.age || "N/A"}</p>
                    <p><strong>Education:</strong> {investor.education || "N/A"}</p>
                    <p><strong>Location:</strong> {investor.city || "N/A"}, {investor.state || "N/A"}, {investor.country || "N/A"}</p>
                </div>
            </div>

            <div className="profile-right">
                <InfoBox title="Firm Details">
                    <p><strong>Firm Name:</strong> {investor.fname || "N/A"}</p>
                    <p><strong>Firm Address:</strong> {investor.faddress || "N/A"}</p>
                </InfoBox>

                <InfoBox title="Contact Info">
                    <p><strong>Mobile:</strong> {investor.mobile || "N/A"}</p>
                    <p><strong>Email:</strong> {investor.email || "N/A"}</p>
                </InfoBox>

                <InfoBox title="Categories">
                    <p>{Array.isArray(investor.categories) ? investor.categories.join(", ") : investor.categories || "N/A"}</p>
                </InfoBox>

                <InfoBox title="Registered On">
                    <p>{investor.regdate ? new Date(investor.regdate).toLocaleDateString() : "N/A"}</p>
                </InfoBox>
            </div>
        </motion.div>
    );
};

const InfoBox = ({ title, children }) => {
    return (
        <motion.div
            className="info-box"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 150 }}
        >
            <h3>{title}</h3>
            {children}
        </motion.div>
    );
};

export default InvestorProfileView;
