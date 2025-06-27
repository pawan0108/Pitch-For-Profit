// models/investmentModel.js
const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  pitchId: { type: mongoose.Schema.Types.ObjectId, ref: "Pitch", required: true },
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: "investor", required: true },
  entrepreneurId: { type: mongoose.Schema.Types.ObjectId, ref: "enp", required: true },
  investAmount: { type: Number, required: true },
  equity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Investment", investmentSchema);
