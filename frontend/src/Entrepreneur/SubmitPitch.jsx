import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SubmitPitch = () => {
    const [formData, setFormData] = useState({ title: "", category: "", fund: "", equity: "", description: "", file: null, }); const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFormData({ ...formData, file: files[0] });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();

            // ✅ Get entrepreneur data from localStorage
            const user = JSON.parse(localStorage.getItem("entrepreneur"));
            data.append("entrepreneurId", user._id);   // ✅ Add this line

            // ✅ Add other form fields
            for (const key in formData) {
                data.append(key, formData[key]);
            }

            // ✅ YAHI likho ye debugging line:
            for (let pair of data.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            const res = await axios.post("http://localhost:8000/pitches", data);
            alert("✅ Pitch submitted successfully!");
            setFormData({
                title: "",
                category: "",
                fund: "",
                equity: "",
                description: "",
                file: null,
            });
        } catch (err) {
            console.error("Submit error:", err);
            alert("❌ Failed to submit pitch.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <motion.div className="container my-5" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
            <div className="card shadow-lg p-4 rounded-4 border-0">
                <h3 className="mb-4 fw-bold text-center text-success">📤 Submit New Pitch</h3>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="form-label">Pitch Title</label>
                        <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required placeholder="Enter pitch title" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Technology">Technology</option>
                            <option value="Health">Health</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="form-label">Funding</label>
                        <input type="number" name="fund" className="form-control" value={formData.fund} onChange={handleChange} required placeholder="Enter Your Funding Requirements" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="form-label">Equity(%)</label>
                        <input type="text" name="equity" className="form-control" value={formData.equity} onChange={handleChange} required placeholder="Giving equity In Investor" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Write a brief about your business idea"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Upload Pitch File (PDF, PPT)</label>
                        <input
                            type="file"
                            name="file"
                            className="form-control"
                            onChange={handleChange}
                            accept=".pdf,.ppt,.pptx"
                        />
                    </div>

                    <div className="text-center">
                        <motion.button
                            type="submit"
                            className="btn btn-success px-4 py-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                        >

                            {loading ? "Submitting..." : "Submit Pitch"}
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}; export default SubmitPitch; 