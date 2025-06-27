const express = require('express');
const router = express.Router();
const Contact = require('../Models/contactModel');

// @route   POST /api/contact
// @desc    Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });

    await newContact.save();

    res.status(201).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact form:', error.message);
    res.status(500).json({ error: 'Server error while submitting contact form' });
  }
});

// @route   GET /api/contact
// @desc    Get all contact form submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 }); // latest first
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact enquiry
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error.message);
    res.status(500).json({ error: 'Server error while deleting enquiry' });
  }
});


module.exports = router;
