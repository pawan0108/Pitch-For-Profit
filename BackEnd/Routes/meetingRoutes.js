const express = require('express');
const router = express.Router();
const Meeting = require('../Models/meetingModel');
const nodemailer = require('nodemailer');

// Email sender setup (consider using dotenv for security)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password' // Use App Password if using Gmail with 2FA
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Pitch For Profit" <your_email@gmail.com>',
      to,
      subject,
      html
    });
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};

// ✅ POST: Create a meeting request
router.post('/meeting-request', async (req, res) => {
  try {
    const {
      entrepreneurid,
      enpname,
      enpcontactno,
      enpemailaddress,
      investorid,
      investorname,
      investoremailaddress,
      meetingdate,
      meetingtime
    } = req.body;

    // ✅ Validate required fields
    if (!enpname || !enpemailaddress || !investorid || !meetingdate || !meetingtime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMeeting = new Meeting({
      entrepreneurid,
      enpname,
      enpcontactno,
      enpemailaddress,
      investorid,
      investorname,
      investoremailaddress,
      meetingdate: new Date(meetingdate),
      meetingtime,
      status: 'pending'
    });

    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ error: 'Failed to create meeting request', details: err.message });
  }
});

// ✅ GET: Meetings for a specific entrepreneur
router.get('/meeting-requests', async (req, res) => {
  const { enpemailaddress } = req.query;
  if (!enpemailaddress) return res.status(400).json({ error: 'Email is required' });

  try {
    const meetings = await Meeting.find({ enpemailaddress });
    res.json(meetings);
  } catch (err) {
    console.error('Fetch meetings error:', err);
    res.status(500).json({ error: 'Error fetching meetings' });
  }
});

// ✅ DELETE: Delete a meeting by ID (Entrepreneur only)
router.delete('/meeting-request/:id', async (req, res) => {
  try {
    const deleted = await Meeting.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({ message: 'Meeting deleted successfully' });
  } catch (err) {
    console.error('Delete meeting error:', err);
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
});


router.get('/meeting-requests-for-investor', async (req, res) => {
  const { investorid } = req.query;
  if (!investorid) return res.status(400).json({ error: 'Investor ID is required' });

  try {
    const meetings = await Meeting.find({ investorid });
    res.json(meetings);
  } catch (err) {
    console.error('Fetch investor meetings error:', err);
    res.status(500).json({ error: 'Error fetching meetings' });
  }
});



// ✅ POST: Approve meeting and send Jitsi link + password
router.post('/meeting-request/:id/approve', async (req, res) => {
  try {
    const meetingid = `PitchForProfit_${Math.random().toString(36).substring(2, 10)}`;
    const meetingpassword = Math.random().toString(36).slice(-8);
    const meetinglink = `https://meet.jit.si/${meetingid}`;

    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        meetingid,
        meetinglink,
        meetingpassword
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    await sendEmail(
      updated.enpemailaddress,
      'Your Pitch Meeting is Approved',
      `
      <p>Dear ${updated.enpname},</p>
      <p>Your meeting with investor <strong>${updated.investorname}</strong> has been approved.</p>
      <p><strong>Meeting Link:</strong> <a href="${meetinglink}">${meetinglink}</a></p>
      <p><strong>Meeting ID:</strong> ${meetingid}</p>
      <p><strong>Password:</strong> ${meetingpassword}</p>
      <p>Please join on time and keep this information confidential.</p>
      <br/>
      <p>Best regards,<br/>Pitch For Profit Team</p>
      `
    );

    res.json(updated);
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Error approving meeting' });
  }
});

// ✅ POST: Cancel meeting and notify entrepreneur
router.post('/meeting-request/:id/cancel', async (req, res) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Meeting not found' });

    await sendEmail(
      updated.enpemailaddress,
      'Meeting Cancelled',
      `
      <p>Dear ${updated.enpname},</p>
      <p>Unfortunately, your meeting with investor <strong>${updated.investorname}</strong> has been cancelled.</p>
      <p>You may request another meeting at your convenience.</p>
      <br/>
      <p>Best regards,<br/>Pitch For Profit Team</p>
      `
    );

    res.json(updated);
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ error: 'Error cancelling meeting' });
  }
});

router.get("/admin-stats", async (req, res) => {
  try {
    const meetingsByMonth = await Meeting.aggregate([
      {
        $match: {
          meetingdate: { $ne: null }
        }
      },
      {
        $project: {
          month: { $month: "$meetingdate" }
        }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({ meetingsByMonth });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET /meetings/monthly/:entrepreneurId
// GET /api/meetings/monthly/:entrepreneurId
router.get('/monthly/:entrepreneurId', async (req, res) => {
  try {
    const entrepreneurId = req.params.entrepreneurId;

    const meetings = await Meeting.find({
      entrepreneurid: entrepreneurId, // <-- Ensure only meetings of this entrepreneur
      investorid: { $exists: true, $ne: null } // Ensure there's a scheduled investor
    });

    const monthly = new Array(12).fill(0);
    meetings.forEach(meeting => {
      if (meeting.meetingdate) {
        const month = new Date(meeting.meetingdate).getMonth();
        monthly[month]++;
      }
    });

    res.json(monthly);
  } catch (err) {
    console.error('Monthly meeting error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/meetings/all
router.get('/all', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ meetingdate: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching all meetings' });
  }
});

module.exports = router;