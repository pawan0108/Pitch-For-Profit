const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: String, // Optional if you're populating from user
  photo : String, // Optional if you're populating from user

  userType: {
    type: String,
    enum: ['Entrepreneur', 'Investor'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType', // Dynamically reference Entrepreneur or Investor
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);