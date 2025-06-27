const express = require('express');
const multer = require('multer');
const path = require('path');
const eventModel = require('../Models/eventsModel'); // Import the events model

const router = express.Router();

// Set up multer for event image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/events'); // save images to uploads/events/
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    }
});

const upload = multer({ storage: storage });

// POST route to upload events
router.post('/', upload.single('eventImage'), async (req, res) => {
    try {
        const { eventTitle, eventDate, eventDescription } = req.body;
        const eventImage = req.file ? req.file.filename : null;

        const newEvent = new eventModel({
            eventTitle,
            eventDate,
            eventDescription,
            eventImage,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event successfully uploaded!' });
    } catch (err) {
        console.error('Error uploading event:', err);
        res.status(500).json({ error: 'Failed to upload event' });
    }
});

// Optional: GET route to fetch all events
router.get('/', async (req, res) => {
    try {
        const allEvents = await eventModel.find().sort({ eventDate: -1 }); // Latest events first
        res.json(allEvents);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

/** DELETE: Delete Event by ID **/
router.delete('/:id', async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Delete associated image if it exists
        if (event.eventImage) {
            const imagePath = path.join(uploadDir, event.eventImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await eventModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

/** PUT: Update Event by ID **/
router.put('/:id', upload.single('eventImage'), async (req, res) => {
    try {
        const { eventTitle, eventDate, eventDescription } = req.body;
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Update fields
        event.eventTitle = eventTitle || event.eventTitle;
        event.eventDate = eventDate || event.eventDate;
        event.eventDescription = eventDescription || event.eventDescription;

        // Handle image update
        if (req.file) {
            if (event.eventImage) {
                const oldPath = path.join(uploadDir, event.eventImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            event.eventImage = req.file.filename;
        }

        await event.save();
        res.json({ message: 'Event updated successfully', event });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

module.exports = router;