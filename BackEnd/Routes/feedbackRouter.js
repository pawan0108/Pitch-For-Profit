const express = require('express');
const router = express.Router();
const Feedback = require('../Models/feedbackModel');
const enpModel = require('../Models/enpModel');
const investorModel = require('../Models/investorModel');

// Route to handle POST request for feedback
router.post('/', async (req, res) => {
  const { userType, user, rating, message } = req.body;

  console.log('Incoming feedback:', { userType, user, rating, message });

  try {
    let userExists;

    if (userType === 'Entrepreneur') {
      userExists = await enpModel.findById(user);
    } else if (userType === 'Investor') {
      userExists = await investorModel.findById(user);
    } else {
      return res.status(400).json({ message: 'Invalid userType provided' });
    }

    if (!userExists) {
      console.log(`User with ID ${user} not found in ${userType} collection`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Save feedback
    const feedback = new Feedback({
      userType,
      user,
      rating,
      message,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'There was an error saving your feedback.' });
  }
});


// GET all feedback with populated user name & profilePic
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
  console.log(feedbacks)
    const enrichedFeedbacks = await Promise.all(
      feedbacks.map(async (fb) => {
        let userInfo = null;

        if (fb.userType === 'Entrepreneur') {
          userInfo = await enpModel.findById(fb.user).select('name photo');
        } else if (fb.userType === 'Investor') {
          userInfo = await investorModel.findById(fb.user).select('name photo');
        }

        return {
          id: fb._id,
          userType: fb.userType,
          rating: fb.rating,
          message: fb.message,
          createdAt: fb.createdAt, // ✅ Yeh line add karo
          user: {
            id: fb.user,
            name: userInfo?.name || 'Unknown',
            profilePic: userInfo?.photo || '',
          },
        };
      })
    );

    res.status(200).json({ feedback: enrichedFeedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
});


module.exports = router;