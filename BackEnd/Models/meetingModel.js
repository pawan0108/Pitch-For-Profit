const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  entrepreneurid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entrepreneur', 
    required: true
  },
  enpname: String,
  enpcontactno: String,
  enpemailaddress: String,
  investorid: mongoose.Schema.Types.ObjectId, 
  investorname: String,
  investoremailaddress: String,
  meetingdate: Date,
  meetingtime: String,
  status: { type: String, default: 'pending' },
  meetingid: String,
  meetinglink: String,
  meetingpassword: String,
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);