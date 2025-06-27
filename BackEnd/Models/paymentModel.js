const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  firmname: {
    type: String,
    required: true
  },
  contactno: {
    type: String,
    required: true
  },
  emailaddress: {
    type: String,
    required: true
  },
  paidcno: {
    type: String,
    required: true
  },
  paymentstatus: {
    type: String,
    enum: ['Pending', 'Approved'],
    default: 'Pending'
  },
  paymentdate: {
    type: Date,
    required: true
  },
  screenshot: {
    type: String, // path to uploaded image
    required: true
  },
  subscribed: {
    type: Boolean,
    default: false
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
