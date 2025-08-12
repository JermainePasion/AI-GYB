const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const photoRoutes = require('./routes/photoRoutes');
const userRoutes = require('./routes/userRoutes');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'] // <-- Needed for JWT auth
}));

app.use(express.json());

// Routes
app.use('/api', photoRoutes);
app.use('/api/users', userRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
