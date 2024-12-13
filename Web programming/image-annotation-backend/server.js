const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/image-annotations', { useNewUrlParser: true, useUnifiedTopology: true });

// Image Schema
const imageSchema = new mongoose.Schema({
    filename: String,
    annotations: Array,
});

const Image = mongoose.model('Image', imageSchema);

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Mock function for image recognition
const mockImageRecognition = (filename) => {
    // Simulate recognizing items in the image
    return [
        { label: "Cat", confidence: 0.95 },
        { label: "Dog", confidence: 0.85 }
    ];
};

// Routes
app.post('/upload', upload.single('image'), async (req, res) => {
    const annotations = mockImageRecognition(req.file.filename);

    const newImage = new Image({
        filename: req.file.filename,
        annotations: annotations,
    });

    await newImage.save();

    // Generate annotation file
    const annotationFilePath = path.join(__dirname, 'uploads', `${req.file.filename}.json`);
    fs.writeFileSync(annotationFilePath, JSON.stringify(annotations, null, 2));

    res.json({ message: 'Image uploaded successfully', image: newImage, annotations });
});

app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});