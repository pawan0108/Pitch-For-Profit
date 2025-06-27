// routes/paymentRouter.js

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const Payment = require('../Models/paymentModel');

const router = express.Router();

// ─── Multer Setup ────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fname = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fname);
  }
});
const upload = multer({ storage });


// ─── POST /api/payment/manual-subscribe ───────────────────────────────────────────
// Handles the form: id, name, firmname, contactno, emailaddress, paidcno, paymentdate,
// plus 'screenshot' file upload. Creates a new Payment doc.
router.post(
  '/manual-subscribe',
  upload.single('screenshot'),
  async (req, res) => {
    try {
      const {
        id,
        name,
        firmname,
        contactno,
        emailaddress,
        paidcno,
        paymentdate
      } = req.body;

      // Basic validation
      if (!id || !name || !emailaddress || !paidcno || !paymentdate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Screenshot is required' });
      }

      // Build document
      const newPayment = new Payment({
        id,
        name,
        firmname,
        contactno,
        emailaddress,
        paidcno,
        paymentdate: new Date(paymentdate),
        screenshot: req.file.path,      // store the file path
        paymentstatus: 'Pending',       // default
        subscribed: false,              // default
        subscriptionDate: Date.now()    // when request was made
      });

      const saved = await newPayment.save();
      return res.status(201).json({
        message: 'Payment request submitted successfully',
        payment: saved
      });
    } catch (err) {
      console.error('Error in manual-subscribe:', err);
      if (err.code === 11000) {
        return res.status(409).json({ error: 'Email already used' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);


// ─── PATCH /api/payment/manual-subscribe/:id/approve ──────────────────────────────
// Admin endpoint: approve a pending payment, mark subscribed=true & paymentstatus=Approved
router.patch(
  '/manual-subscribe/:id/approve',
  async (req, res) => {
    try {
      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            paymentstatus: 'Approved',
            subscribed: true,
            subscriptionDate: Date.now()
          }
        },
        { new: true }
      );
      if (!payment) {
        return res.status(404).json({ error: 'Payment request not found' });
      }
      return res.json({
        message: 'Payment approved and subscription activated',
        payment
      });
    } catch (err) {
      console.error('Error approving payment:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PATCH /api/payment/update-status/:id - Admin: Update paymentstatus and subscribed
router.patch('/update-status/:id', async (req, res) => {
    try {
      const { paymentstatus } = req.body;
  
      if (!['Approved', 'Pending'].includes(paymentstatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
  
      const updated = await Payment.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            paymentstatus,
            subscribed: paymentstatus === 'Approved',
            subscriptionDate: Date.now()
          }
        },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: 'Payment not found' });
      }
  
      return res.json({ message: `Payment ${paymentstatus.toLowerCase()}`, payment: updated });
    } catch (err) {
      console.error('Status update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// GET /api/payment/all - Admin: View all payment requests
router.get('/all', async (req, res) => {
    try {
      const payments = await Payment.find().sort({ paymentdate: -1 });
      res.json(payments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      res.status(500).json({ error: 'Failed to retrieve payments' });
    }
  });
  

router.get('/check-status/:email', async (req, res) => {
  try {
    const payment = await Payment.findOne({ emailaddress: req.params.email })
      .sort({ subscriptionDate: -1 }); // get latest entry

    if (!payment) {
      return res.status(404).json({ error: 'No payment record found' });
    }

    res.json({
      subscribed: payment.subscribed,
      paymentstatus: payment.paymentstatus,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ─── GET /api/payment/status ────────────────────────────────────────────────────
// Check payment status for a specific investor by investorId
router.get('/status', async (req, res) => {
    console.log('Status route hit with investorId:', req.query.investorId);
    try {
      const { investorId } = req.query;
      
  
      if (!investorId) {
        return res.status(400).json({ error: 'Investor ID is required' });
      }
  
      const payment = await Payment.findOne({ id: investorId })
        .sort({ subscriptionDate: -1 }); // get latest entry
  
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
  
      res.json({
        subscribed: payment.subscribed,
        paymentstatus: payment.paymentstatus,
      });
    } catch (err) {
        
      console.error('Error fetching payment status:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  
module.exports = router;
