const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ImageDetails = require('./models/imageDetails'); // Import the ImageDetails model

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/src/images/'); // Destination directory for storing images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now(); // Add unique timestamp to filename to prevent overwriting
        cb(null, uniqueSuffix + file.originalname); // Use original filename with timestamp as the filename
    },
});

const upload = multer({ storage: storage });

// Route for uploading an image
router.post('/upload-image', upload.single('image'), async (req, res) => {
    const { title, date, content } = req.body;
    const imageName = req.file.filename;

    try {
        await ImageDetails.create({ image: imageName, title, date, content });
        res.json({ status: 'ok', imageName: imageName });
    } catch (error) {
        console.error('Error inserting image details:', error);
        res.status(500).json({ status: 'error', message: 'Failed to insert image details' });
    }
});

// Route for fetching all images
router.get('/get-image', async (req, res) => {
    try {
        const images = await ImageDetails.find().sort({ priority: -1 });
        res.json({ success: true, data: images });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch images' });
    }
});

// Route for prioritizing an image
router.put('/prioritize-image/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const image = await ImageDetails.findById(id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        image.priority = (image.priority || 0) + 1;
        const updatedImage = await image.save();
        res.json({ success: true, data: updatedImage });
    } catch (error) {
        console.error('Error prioritizing image:', error);
        res.status(500).json({ success: false, message: 'Failed to prioritize image' });
    }
});

// Route for reducing priority of an image
router.put('/reduce-priority/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const image = await ImageDetails.findById(id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        const updatedPriority = Math.max(image.priority - 1, 1);
        image.priority = updatedPriority;
        await image.save();
        res.json({ success: true, data: image });
    } catch (error) {
        console.error('Error reducing priority:', error);
        res.status(500).json({ success: false, message: 'Failed to reduce priority' });
    }
});

// Route for deleting an image
router.delete('/delete-image/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedImage = await ImageDetails.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        const imagePath = path.join(__dirname, '..', 'frontend', 'src', 'images', deletedImage.image);
        fs.unlinkSync(imagePath);
        res.json({ success: true, message: 'Image deleted successfully', data: deletedImage });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, message: 'Failed to delete image' });
    }
});

module.exports = router;
