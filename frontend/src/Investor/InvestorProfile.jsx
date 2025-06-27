import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/css/InvestorProfile.css";
import admin from '../assets/img/admin/admin.png'

const InvestorProfile = () => {
    const [investor, setInvestor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchInvestorData = async () => {
            try {
                const storedInvestor = JSON.parse(localStorage.getItem("investor"));
                
       
                if (storedInvestor) {
                    // const id = storedInvestor._id || storedInvestor.id;
                    const id = storedInvestor._id;
                    console.log("Fetching investor with ID:", id);
                    // Always fetch fresh from backend, don't rely on localStorage
                    const res = await axios.get(`http://localhost:8000/investor/${id}`);
                    
                    setInvestor(res.data);
                    setFormData(res.data);
                
                    // Update localStorage with the latest data
                    localStorage.setItem("investor", JSON.stringify(res.data));
                }
                 else {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // const id = investor._id || investor.id;
            const id = investor._id;
            const data = new FormData();

            // Append all fields to FormData
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "photo") {
                    data.append("photo", value); // actual file
                } else {
                    data.append(key, value);
                }
            });

            const res = await axios.put(`http://localhost:8000/investor/${id}`, data); // ✅ No manual headers

            setInvestor(res.data.investor);
            localStorage.setItem("investor", JSON.stringify(res.data.investor));
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile. Try again.");
        }
    };



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

                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                </button>
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

            {/* Edit Modal */}
            {isEditing && (
                <div className="edit-modal">
                    <form onSubmit={handleUpdate} className="edit-form">
                        <h2>Edit Profile</h2>
                        <input
                            type="file"
                            onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                photo: e.target.files[0]
                            }))}
                        />

                        <input type="text" name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="Name" required />
                        <input type="text" name="age" value={formData.age || ""} onChange={handleInputChange} placeholder="Age" required />
                        <input type="text" name="mobile" value={formData.mobile || ""} onChange={handleInputChange} placeholder="Mobile" required />
                        <input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} placeholder="Email" required />
                        <input type="text" name="education" value={formData.education || ""} onChange={handleInputChange} placeholder="Education" />
                        <input type="text" name="city" value={formData.city || ""} onChange={handleInputChange} placeholder="City" />
                        <input type="text" name="state" value={formData.state || ""} onChange={handleInputChange} placeholder="State" />
                        <input type="text" name="country" value={formData.country || ""} onChange={handleInputChange} placeholder="Country" />

                        <div className="button-group">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
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

export default InvestorProfile;
