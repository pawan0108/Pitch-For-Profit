const express = require('express');
const router = express.Router();
const Admin = require('../Models/adminModel');
const investorModel = require('../Models/investorModel');
const enpModel = require('../Models/enpModel');
const meetingModel = require('../Models/meetingModel'); // Agar file me hai

// Admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", admin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error while logging in" });
  }
});

// 📊 Admin Dashboard Stats Route
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [totalInvestors, totalEntrepreneurs, totalMeetings] = await Promise.all([
      investorModel.countDocuments(),
      enpModel.countDocuments(),
      meetingModel.countDocuments()
    ]);

    res.json({
      investors: totalInvestors,
      entrepreneurs: totalEntrepreneurs,
      meetings: totalMeetings
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// In routes/adminRouter.js

router.get("/stats", async (req, res) => {
  try {
    const entrepreneurCategoryAgg = await enpModel.aggregate([
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ]);

    const entrepreneurCountryAgg = await enpModel.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
    ]);

    const investorCategoryAgg = await investorModel.aggregate([
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ]);

    const investorCountryAgg = await investorModel.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
    ]);

    res.json({
      entrepreneurCategoryAgg,
      entrepreneurCountryAgg,
      investorCategoryAgg,
      investorCountryAgg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});




module.exports = router;
