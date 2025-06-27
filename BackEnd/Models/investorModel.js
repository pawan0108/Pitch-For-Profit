const mongoose = require('mongoose');

var investorSchema = mongoose.Schema({
    name: String,
    gender: String,
    address: String,
    country: String,
    state: String,
    city: String,
    fname: String,
    faddress: String,
    categories: String,
    mobile: Number,
    email: String,
    regdate: Date,
    password: String,
    photo: {
        type: String // ✅ this is critical for saving photo URL
      },
    age: String,
    education: String,
    isApproved: {
        type: Boolean,
        default: false
      },
      isActive: {
        type: Boolean,
        default: true
      }

});

var investorModel = mongoose.model('investor', investorSchema);

module.exports = investorModel; 