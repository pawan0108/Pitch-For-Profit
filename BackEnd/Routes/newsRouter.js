const express = require('express');
const multer = require('multer');
const path = require('path');
const newsModel = require('../Models/newsModel'); // Import the news model

const router = express.Router();

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/news'); // Save images to uploads/news/
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage: storage });

// POST route to upload news
router.post('/', upload.single('newsImage'), async (req, res) => {
    try {
        const { newsTitle, newsText } = req.body;  // Now extracting the newsTitle and newsText
        const newsDate = new Date().toISOString().slice(0, 10); // Date in yyyy-mm-dd format

        const newsImage = req.file ? req.file.filename : null; // If image is uploaded, use filename

        const newNews = new newsModel({
            newsTitle,   // Add the news title field
            newsText,    // Add the news text content
            newsDate,    // Add the news date
            newsImage,   // Add the image (if uploaded)
        });

        await newNews.save();  // Save the news document to the database
        res.status(201).json({ message: 'News successfully uploaded!' });
    } catch (err) {
        console.error('Error uploading news:', err);
        res.status(500).json({ error: 'Failed to upload news' });
    }
});

// Optional: GET route to fetch all news
router.get('/', async (req, res) => {
    try {
        const allNews = await newsModel.find().sort({ newsDate: -1 }); // Latest news first
        res.json(allNews);  // Return all news as JSON
    } catch (err) {
        console.error('Error fetching news:', err);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});


// DELETE: Remove a news item
router.delete('/:id', async (req, res) => {
    try {
      const news = await newsModel.findById(req.params.id);
      if (!news) {
        return res.status(404).json({ error: 'News not found' });
      }
  
      // Delete image from file system if exists
      if (news.newsImage) {
        const imagePath = path.join(__dirname, '..', 'uploads', 'news', news.newsImage);
        fs.unlink(imagePath, (err) => {
          if (err) console.warn('Failed to delete image:', err.message);
        });
      }
  
      await newsModel.findByIdAndDelete(req.params.id);
      res.json({ message: 'News deleted successfully' });
    } catch (err) {
      console.error('Error deleting news:', err);
      res.status(500).json({ error: 'Failed to delete news' });
    }
  });
  
  // UPDATE: Update a news item
  router.put('/:id', upload.single('newsImage'), async (req, res) => {
    try {
      const { newsTitle, newsText } = req.body;
  
      const updatedData = {
        newsTitle,
        newsText
      };
  
      if (req.file) {
        updatedData.newsImage = req.file.filename;
  
        // Optional: delete old image
        const oldNews = await newsModel.findById(req.params.id);
        if (oldNews && oldNews.newsImage) {
          const oldImagePath = path.join(__dirname, '..', 'uploads', 'news', oldNews.newsImage);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.warn('Failed to delete old image:', err.message);
          });
        }
      }
  
      const updatedNews = await newsModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      if (!updatedNews) {
        return res.status(404).json({ error: 'News not found' });
      }
  
      res.json({ message: 'News updated successfully', data: updatedNews });
    } catch (err) {
      console.error('Error updating news:', err);
      res.status(500).json({ error: 'Failed to update news' });
    }
  });
module.exports = router;