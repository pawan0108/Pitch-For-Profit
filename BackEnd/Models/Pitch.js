const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    fund: {
        type: Number,
        required: true
    },
    equity: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: false
    },
    entrepreneurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur',   required: true }, // Important
    approved: { type: Boolean, default: false },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Pitch', pitchSchema);
