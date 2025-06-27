import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/css/InvestorProfile.css"; // Reuse same CSS
import defaultImg from '../assets/img/admin/admin.png';

const EntrepreneurProfile = () => {
    const [entrepreneur, setEntrepreneur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedEnp = JSON.parse(localStorage.getItem("entrepreneur"));
                if (storedEnp) {
                    const id = storedEnp._id || storedEnp.id;
                    const res = await axios.get(`http://localhost:8000/entrepreneur/${id}`);
                    setEntrepreneur(res.data);
                    setFormData(res.data);
                    localStorage.setItem("entrepreneur", JSON.stringify(res.data));
                } else {
                    setError("No entrepreneur data found.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const id = entrepreneur._id;
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "photo") {
                    data.append("photo", value);
                } else {
                    data.append(key, value);
                }
            });

            const res = await axios.put(`http://localhost:8000/entrepreneur/${id}`, data);
            setEntrepreneur(res.data.entrepreneur);
            localStorage.setItem("entrepreneur", JSON.stringify(res.data.entrepreneur));
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update error:", err);
            alert("Update failed.");
        }
    };

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
                    <img src={entrepreneur.photo ||defaultImg} alt="Profile" className="profile-image" />
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
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
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

            {isEditing && (
                <div className="edit-modal">
                    <form onSubmit={handleUpdate} className="edit-form">
                        <h2>Edit Profile</h2>
                        <input type="file" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} />
                        <input type="text" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Name" required />
                        <input type="number" name="age" value={formData.age || ""} onChange={handleChange} placeholder="Age" />
                        <input type="text" name="education" value={formData.education || ""} onChange={handleChange} placeholder="Education" />
                        <input type="text" name="address" value={formData.address || ""} onChange={handleChange} placeholder="Address" />
                        <input type="text" name="mobile" value={formData.mobile || ""} onChange={handleChange} placeholder="Mobile" required />
                        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" required />
                        <input type="text" name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" />
                        <input type="text" name="state" value={formData.state || ""} onChange={handleChange} placeholder="State" />
                        <input type="text" name="country" value={formData.country || ""} onChange={handleChange} placeholder="Country" />

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

const InfoBox = ({ title, children }) => (
    <motion.div className="info-box" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 150 }}>
        <h3>{title}</h3>
        {children}
    </motion.div>
);

export default EntrepreneurProfile;
