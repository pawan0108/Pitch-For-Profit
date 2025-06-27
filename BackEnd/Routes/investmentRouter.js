const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Investor = require('../Models/investorModel'); // 
const Investment = require('../Models/investmentModel');


// POST: Submit new investment
// POST: Submit new investment (only once unless rejected)
router.post('/', async (req, res) => {
  try {
    const { investorId, pitchId } = req.body;

    const existing = await Investment.findOne({
      investorId,
      pitchId,
      status: { $ne: 'rejected' } // prevent raise if status isn't rejected
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already raised for this pitch.' });
    }

    const newInvestment = new Investment({ ...req.body, status: 'pending' });
    await newInvestment.save();
    res.status(201).json(newInvestment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET: All investments (or filter by investor/pitch if needed)
// In investmentRouter.js
router.get('/investor/:id', async (req, res) => {
  try {
    const investments = await Investment.find({ investorId: req.params.id })
    .populate('pitchId')
    .populate('entrepreneurId');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add this in investmentRouter.js


router.get('/pitch/:pitchId', async (req, res) => {
  const { pitchId } = req.params;

  // ✅ Step 1: Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(pitchId)) {
    return res.status(400).json({ message: 'Invalid pitch ID format' });
  }

  try {
    // ✅ Step 2: Query safely with cast ObjectId
    const investments = await Investment.find({ pitchId: new mongoose.Types.ObjectId(pitchId) }).populate('investorId');
    res.status(200).json(investments);
  } catch (err) {
    console.error('❌ Error fetching investments:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Accept Investor

router.put('/accept/:id', async (req, res) => {
  try {
    const investment = await Investment.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(investment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//  DELETE: Cancel Investment

router.delete('/:id', async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Investment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
