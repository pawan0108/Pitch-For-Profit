const express = require('express');
const investorModel = require('../Models/investorModel');
const investorRouter = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

// 👉 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 👉 Update investor with optional photo upload
investorRouter.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const investorId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = `http://localhost:8000/uploads/${req.file.filename}`;
    }

    const updatedInvestor = await investorModel.findByIdAndUpdate(
      investorId,
      updateData,
      { new: true }
    );

    if (!updatedInvestor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    res.json({ message: 'Investor updated successfully', investor: updatedInvestor });
  } catch (error) {
    console.error('Error updating investor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// 👉 Search Investors
investorRouter.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query || query.trim() === '') {
      const allInvestors = await investorModel.find();
      return res.json(allInvestors);
    }

    const regex = new RegExp(query, 'i');
    const searchConditions = [
      { name: { $regex: regex } },
      { email: { $regex: regex } },
      { fname: { $regex: regex } },
      { categories: { $regex: regex } }
    ];

    if (!isNaN(query)) {
      searchConditions.push({ mobile: Number(query) });
    }

    const investors = await investorModel.find({ $or: searchConditions });
    res.json(investors);
  } catch (error) {
    console.error("Error while searching investors:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 👉 Get all investors
investorRouter.get('/all', async (req, res) => {
  try {
    const data = await investorModel.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 👉 Get single investor by ID
investorRouter.get('/:id', async (req, res) => {
  try {
    const investor = await investorModel.findById(req.params.id);
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    res.json(investor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 👉 Create new investor
investorRouter.post('/', async (req, res) => {
  try {
    const newInvestor = await investorModel.create(req.body);
    res.status(201).json({ message: 'Investor created successfully', investor: newInvestor });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// 👉 Delete investor
investorRouter.delete('/:id', async (req, res) => {
  try {
    const deletedInvestor = await investorModel.findByIdAndDelete(req.params.id);
    if (!deletedInvestor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    res.json({ message: 'Investor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 👉 Login Investor
// 👉 Login Investor with approval check
investorRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const investor = await investorModel.findOne({ email });

    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    if (investor.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!investor.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    res.status(200).json({
      message: 'Login successful',
      investor: {
        _id: investor._id,
        name: investor.name,
        email: investor.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// 👉 Upload Profile Photo
investorRouter.post('/upload-photo/:id', upload.single('photo'), async (req, res) => {
  try {
    const investorId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const photoUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    const updatedInvestor = await investorModel.findByIdAndUpdate(
      investorId,
      { photo: photoUrl },
      { new: true }
    );
    if (!updatedInvestor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    res.json({
      message: 'Photo uploaded successfully',
      photoUrl: updatedInvestor.photo
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Approve or deactivate investor
investorRouter.patch('/status/:id', async (req, res) => {
  const { isApproved, isActive } = req.body;

  try {
    const investor = await investorModel.findById(req.params.id);
    if (!investor) return res.status(404).json({ message: 'Investor not found' });

    const wasPreviouslyApproved = investor.isApproved;

    investor.isApproved = isApproved;
    investor.isActive = isActive;
    await investor.save();

    // 👉 Send approval email only when status changes to approved
    if (isApproved && !wasPreviouslyApproved) {
      // ✅ Configure transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'codeshare299@gmail.com',
          pass: 'fpqhplllecuvdaeu' // Use App Password (not raw email password)
        }
      });

      const mailOptions = {
        from: 'codeshare299@gmail.com',
        to: investor.email,
        subject: '🎉 Your Investor Account is Approved!',
        text: `Hello ${investor.name},\n\nYour investor account has been approved. You can now log in and access your dashboard.\n\nThank you!`
      };

      // ✅ Send email
      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent to:', investor.email);
      } catch (mailError) {
        console.error('❌ Email sending failed:', mailError);
      }
      
    }

    res.json({ message: 'Status updated', investor });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





// ✅ Email duplication check
// investorRouter.get('/check-email', async (req, res) => {
//   try {
//     const { email } = req.query;
//     const existingInvestor = await investorModel.findOne({ email });
//     res.json({ exists: !!existingInvestor });
//   } catch (err) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// });


module.exports = investorRouter;




// const express = require('express');
// const investorModel = require('../Models/investorModel');
// const investorRouter = express.Router();
// const multer = require('multer');
// const nodemailer = require('nodemailer');
// const path = require('path');
// const bcrypt = require('bcrypt');

// // 👉 Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// // 👉 Update investor with optional photo upload
// investorRouter.put('/:id', upload.single('photo'), async (req, res) => {
//   try {
//     const investorId = req.params.id;
//     const updateData = { ...req.body };

//     if (req.file) {
//       updateData.photo = `http://localhost:8000/uploads/${req.file.filename}`;
//     }

//     const updatedInvestor = await investorModel.findByIdAndUpdate(
//       investorId,
//       updateData,
//       { new: true }
//     );

//     if (!updatedInvestor) {
//       return res.status(404).json({ message: 'Investor not found' });
//     }

//     res.json({ message: 'Investor updated successfully', investor: updatedInvestor });
//   } catch (error) {
//     console.error('Error updating investor:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // 👉 Search Investors
// investorRouter.get('/search', async (req, res) => {
//   try {
//     const query = req.query.query;
//     if (!query || query.trim() === '') {
//       const allInvestors = await investorModel.find().lean();
//       return res.json(allInvestors);
//     }

//     const regex = new RegExp(query, 'i');
//     const searchConditions = [
//       { name: { $regex: regex } },
//       { email: { $regex: regex } },
//       { fname: { $regex: regex } },
//       { categories: { $regex: regex } }
//     ];

//     if (!isNaN(query)) {
//       searchConditions.push({ mobile: Number(query) });
//     }

//     const investors = await investorModel.find({ $or: searchConditions }).lean();
//     res.json(investors);
//   } catch (error) {
//     console.error("Error while searching investors:", error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // 👉 Get all investors
// investorRouter.get('/all', async (req, res) => {
//   try {
//     const data = await investorModel.find().lean();
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // 👉 Get single investor by ID
// investorRouter.get('/:id', async (req, res) => {
//   try {
//     const investor = await investorModel.findById(req.params.id).lean();
//     if (!investor) {
//       return res.status(404).json({ message: 'Investor not found' });
//     }
//     res.json(investor);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // 👉 Create new investor
// investorRouter.post('/', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const exists = await investorModel.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ message: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newInvestor = await investorModel.create({ ...req.body, password: hashedPassword });

//     res.status(201).json({ message: 'Investor created successfully', investor: newInvestor });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // 👉 Delete investor
// investorRouter.delete('/:id', async (req, res) => {
//   try {
//     const deletedInvestor = await investorModel.findByIdAndDelete(req.params.id);
//     if (!deletedInvestor) {
//       return res.status(404).json({ message: 'Investor not found' });
//     }
//     res.json({ message: 'Investor deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // 👉 Login Investor with approval check
// investorRouter.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const investor = await investorModel.findOne({ email });

//     if (!investor) {
//       return res.status(404).json({ message: 'Investor not found' });
//     }

//     const isMatch = await bcrypt.compare(password, investor.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     if (!investor.isApproved) {
//       return res.status(403).json({ message: 'Your account is pending approval' });
//     }

//     res.status(200).json({
//       message: 'Login successful',
//       investor: {
//         _id: investor._id,
//         name: investor.name,
//         email: investor.email,
//         photo: investor.photo,
//         isActive: investor.isActive,
//         isApproved: investor.isApproved,
//         fname: investor.fname,
//         categories: investor.categories
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // 👉 Upload Profile Photo
// investorRouter.post('/upload-photo/:id', upload.single('photo'), async (req, res) => {
//   try {
//     const investorId = req.params.id;
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     const photoUrl = `http://localhost:8000/uploads/${req.file.filename}`;
//     const updatedInvestor = await investorModel.findByIdAndUpdate(
//       investorId,
//       { photo: photoUrl },
//       { new: true }
//     );
//     if (!updatedInvestor) {
//       return res.status(404).json({ message: 'Investor not found' });
//     }
//     res.json({
//       message: 'Photo uploaded successfully',
//       photoUrl: updatedInvestor.photo
//     });
//   } catch (error) {
//     console.error('Error uploading photo:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // ✅ Approve or deactivate investor
// investorRouter.patch('/status/:id', async (req, res) => {
//   const { isApproved, isActive } = req.body;

//   try {
//     const investor = await investorModel.findById(req.params.id);
//     if (!investor) return res.status(404).json({ message: 'Investor not found' });

//     const wasPreviouslyApproved = investor.isApproved;

//     investor.isApproved = isApproved;
//     investor.isActive = isActive;
//     await investor.save();

//     // 👉 Send approval email only when status changes to approved
//     if (isApproved && !wasPreviouslyApproved) {
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'codeshare299@gmail.com',
//           pass: 'fpqhplllecuvdaeu' // App password
//         }
//       });

//       const mailOptions = {
//         from: 'codeshare299@gmail.com',
//         to: investor.email,
//         subject: '🎉 Your Investor Account is Approved!',
//         text: `Hello ${investor.name},\n\nYour investor account has been approved. You can now log in and access your dashboard.\n\nThank you!`
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log('✅ Email sent to:', investor.email);
//       } catch (mailError) {
//         console.error('❌ Email sending failed:', mailError);
//       }
//     }

//     res.json({ message: 'Status updated', investor });
//   } catch (error) {
//     console.error('Status update error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Node.js + Express example (backend)
// app.get('/investor/check-email', async (req, res) => {
//   const email = req.query.email;
//   try {
//     const existing = await Investor.findOne({ email });
//     res.json({ exists: !!existing });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// module.exports = investorRouter;
