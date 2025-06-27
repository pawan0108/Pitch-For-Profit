const mongoose = require('mongoose');

// Define the schema for news
const newsSchema = new mongoose.Schema({
    newsTitle: { type: String, required: true }, // Add title field
    newsText: { type: String, required: true },
    newsDate: { type: String, required: true },
    newsImage: { type: String }, // optional field for image
  });
  

// Create the News model
const newsModel = mongoose.model('news', newsSchema);

module.exports = newsModel;