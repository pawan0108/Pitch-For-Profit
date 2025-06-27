const express = require('express');
const enpModel = require('../Models/enpModel');
const enpRouter = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ UPDATE Entrepreneur with optional photo
enpRouter.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const entrepreneurId = req.params.id;
    const updateData = { ...req.body };

    // ✅ Add photo if file uploaded
    if (req.file) {
      updateData.photo = `http://localhost:8000/uploads/${req.file.filename}`;
    }

    // ✅ Update and return latest data
    const updatedEnp = await enpModel.findByIdAndUpdate(
      entrepreneurId,
      updateData,
      { new: true }
    );

    if (!updatedEnp) {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }

    res.json({ message: 'Entrepreneur updated successfully', entrepreneur: updatedEnp });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// 👉 Search route
enpRouter.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query || query.trim() === '') {
      const all = await enpModel.find();
      return res.json(all);
    }

    const regex = new RegExp(query, 'i');
    const searchConditions = [
      { name: { $regex: regex } },
      { email: { $regex: regex } },
      { fname: { $regex: regex } }
    ];

    if (!isNaN(query)) {
      searchConditions.push({ mobile: Number(query) });
    }

    const results = await enpModel.find({ $or: searchConditions });
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 👉 Get all entrepreneurs
enpRouter.get('/all', async (req, res) => {
  try {
    const data = await enpModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ mes: err.message });
  }
});

// 👉 Get single entrepreneur
enpRouter.get('/:id', async (req, res) => {
  try {
    const enp = await enpModel.findById(req.params.id);
    if (!enp) return res.status(404).json({ mes: "Not Found" });
    res.json(enp);
  } catch (err) {
    res.status(500).json({ mes: err.message });
  }
});

// 👉 Create new entrepreneur
enpRouter.post('/', async (req, res) => {
  try {
    const result = await enpModel.create(req.body);
    res.status(201).json({ mes: "Success", entrepreneur: result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ mes: err.message });
  }
});

// 👉 Update entrepreneur
// enpRouter.put('/:id', async (req, res) => {
//   try {
//     const updated = await enpModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ mes: "Updated successfully", data: updated });
//   } catch (err) {
//     res.status(500).json({ mes: err.message });
//   }
// });

// 👉 Delete entrepreneur
enpRouter.delete('/:id', async (req, res) => {
  try {
    await enpModel.findByIdAndDelete(req.params.id);
    res.json({ mes: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ mes: err.message });
  }
});

// ✅ Login with approval check
enpRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const enp = await enpModel.findOne({ email });

    if (!enp) {
      return res.status(404).json({ message: 'Entrepreneur not found' });
    }

    if (enp.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!enp.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    res.status(200).json({
      message: 'Login successful',
      entrepreneur: {
        id: enp._id,
        name: enp.name,
        email: enp.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Approve or deactivate entrepreneur + send approval email
enpRouter.patch('/status/:id', async (req, res) => {
  const { isApproved, isActive } = req.body;

  try {
    const enp = await enpModel.findById(req.params.id);
    if (!enp) return res.status(404).json({ message: 'Entrepreneur not found' });

    const wasPreviouslyApproved = enp.isApproved;

    enp.isApproved = isApproved;
    enp.isActive = isActive;
    await enp.save();

    // ✅ Send email on first-time approval
    if (isApproved && !wasPreviouslyApproved) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'codeshare299@gmail.com',
          pass: 'fpqhplllecuvdaeu' // Use App Password
        }
      });

      const mailOptions = {
        from: '"Pitch For Profit" <codeshare299@gmail.com>',
        to: enp.email,
        subject: '🎉 Your Entrepreneur Account is Approved!',
        text: `Hello ${enp.name},\n\nYour entrepreneur account has been approved. You can now log in and access your dashboard.\n\nBest of luck with your venture!`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent to:', enp.email);
      } catch (mailErr) {
        console.error('❌ Email sending failed:', mailErr);
      }
    }

    res.json({ message: 'Status updated', entrepreneur: enp });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = enpRouter;
