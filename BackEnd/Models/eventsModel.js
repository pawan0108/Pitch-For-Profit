const mongoose = require('mongoose');

// Define the schema for events
const eventsSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventImage: { type: String }, // optional field for image
});

// Create the Events model
const eventsModel = mongoose.model('events', eventsSchema);

module.exports = eventsModel;