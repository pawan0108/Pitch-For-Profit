const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Pitch = require('../Models/Pitch');
const investmentModel = require('../Models/investmentModel');
const meetingModel = require('../Models/meetingModel');

// Create uploads folder if not exists
const uploadFolder = 'uploads';
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
};

const upload = multer({ storage, fileFilter });

/* ✅ POST /pitches — Submit Pitch */
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { title, category, fund, equity, description, entrepreneurId } = req.body;

        if (!title || !category || !description || !entrepreneurId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newPitch = new Pitch({
            title,
            category,
            fund,
            equity,
            description,
            filePath: req.file ? req.file.path : null,
            entrepreneurId,
            submittedAt: new Date()
        });

        await newPitch.save();
        res.status(201).json({ message: '✅ Pitch submitted successfully', pitch: newPitch });
    } catch (error) {
        console.error('❌ Error submitting pitch:', error.message);
        res.status(500).json({ message: 'Failed to submit pitch' });
    }
});

/* ✅ GET /pitches/user/:id — Pitches by Entrepreneur */
router.get('/user/:id', async (req, res) => {
    try {
        const pitches = await Pitch.find({ entrepreneurId: req.params.id }).sort({ submittedAt: -1 });
        res.status(200).json(pitches);
    } catch (error) {
        console.error('❌ Error fetching pitches:', error.message);
        res.status(500).json({ message: 'Failed to fetch pitches' });
    }
});

/* ✅ GET /pitches — All Pitches */
router.get('/', async (req, res) => {
    try {
        const pitches = await Pitch.find();
        res.status(200).json(pitches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ✅ PUT /pitches/:id/approve — Approve Pitch */
router.put('/:id/approve', async (req, res) => {
    try {
        const updatedPitch = await Pitch.findByIdAndUpdate(
            req.params.id,
            { approved: true, status: 'approved' },
            { new: true }
        );

        if (!updatedPitch) return res.status(404).json({ message: 'Pitch not found' });

        res.status(200).json({ message: '✅ Pitch approved', pitch: updatedPitch });
    } catch (err) {
        console.error('❌ Error approving pitch:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ✅ GET /pitches/count/:pitchId — Investor Count */
router.get('/count/:pitchId', async (req, res) => {
    try {
        const count = await investmentModel.countDocuments({
            pitchId: req.params.pitchId,
            status: { $ne: 'rejected' }
        });

        res.json({ count });
    } catch (err) {
        console.error('❌ Error counting investors:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /pitches/:id — Delete a pitch
router.delete('/:id', async (req, res) => {
    try {
      const pitch = await Pitch.findById(req.params.id);
      if (!pitch) return res.status(404).json({ message: 'Pitch not found' });
  
      // Optional: Delete associated file
      if (pitch.filePath && fs.existsSync(pitch.filePath)) {
        fs.unlinkSync(pitch.filePath);
      }
  
      await Pitch.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Pitch deleted successfully' });
    } catch (error) {
      console.error('Error deleting pitch:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


// Update this route in your router
router.get('/investor-stats/:investorId', async (req, res) => {
    try {
      const investorId = req.params.investorId;
  
      // Get all investments by this investor
      const investments = await investmentModel.find({ investorId });
  
      const totalPitches = investments.length;
      const totalRaised = investments.length;
      const selected = investments.filter(inv => inv.status === 'approved').length;
  
      const meetings = await meetingModel.find({ investorid: investorId });
      const totalMeetings = meetings.length;
  
      res.json({
        totalPitches,
        totalRaised,  
        selected,
        notSelected: totalPitches - selected,
        totalMeetings,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // GET /pitches/stats/:entrepreneurId

  const getCategoryStatsForEntrepreneur = async (req, res) => {
    try {
      const entrepreneurId = req.params.entrepreneurId;
  
      const pitches = await Pitch.find({ entrepreneurId });
  
      // Count pitches by category
      const categoryCount = pitches.reduce((acc, pitch) => {
        const category = pitch.category || 'Unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
  
      res.json({ categoryCount });
    } catch (error) {
      console.error('Error fetching category stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  
  
  const getPitchStatsForEntrepreneur = async (req, res) => {
    try {
      const entrepreneurId = req.params.entrepreneurId;
  
      if (!mongoose.Types.ObjectId.isValid(entrepreneurId)) {
        return res.status(400).json({ message: 'Invalid entrepreneur ID' });
      }
  
      // Get all pitches by this entrepreneur
      const pitches = await Pitch.find({ entrepreneurId });
      const pitchIds = pitches.map(p => p._id);
  
      const totalPitches = pitches.length;
  
      // Get all investments related to these pitches
      const investments = await investmentModel.find({
        pitchId: { $in: pitchIds },
        status: { $ne: 'rejected' }  // consider only valid statuses
      });
  
      const raisedPitches = investments.length;
  
      // Count status occurrences
      const investmentStatus = {
        approved: 0,
        pending: 0,
        cancelled: 0
      };
  
      investments.forEach(inv => {
        const status = inv.status?.toLowerCase();
        if (status === 'approved') investmentStatus.approved++;
        else if (status === 'pending') investmentStatus.pending++;
        else if (status === 'cancelled') investmentStatus.cancelled++;
      });
  
      res.json({
        totalPitches,
        raisedPitches,
        investmentStatus
      });
  
    } catch (error) {
      console.error('Error fetching entrepreneur pitch stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
// Corrected routes:
router.get('/stats/:entrepreneurId', getPitchStatsForEntrepreneur);
router.get('/category-stats/:entrepreneurId', getCategoryStatsForEntrepreneur);

  // GET /api/pitches/monthly/:entrepreneurId
  router.get('/monthly/:entrepreneurId', async (req, res) => {
    try {
      const entrepreneurId = req.params.entrepreneurId;
      const pitches = await Pitch.find({ entrepreneurId });
  
      const monthly = new Array(12).fill(0);
      pitches.forEach(pitch => {
        const month = new Date(pitch.submittedAt).getMonth(); // Ensure submittedAt exists
        monthly[month]++;
      });
  
      res.json(monthly);
    } catch (err) {
      console.error('Monthly pitch error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  
module.exports = router;
