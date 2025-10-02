const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path'); 
const photoRoutes = require('./routes/photoRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ✅ allow PUT, DELETE
  allowedHeaders: ['Content-Type', 'Authorization'],    // ✅ allow JWT headers
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', photoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
