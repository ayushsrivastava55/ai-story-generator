const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (to be imported)
const storyRoutes = require('./routes/storyRoutes');
app.use('/api/stories', storyRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Story Generator API is running' });
});

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/story-generator', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server with error handling
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
    console.error('Server error:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise rejection:', err);
    server.close(() => process.exit(1));
});
