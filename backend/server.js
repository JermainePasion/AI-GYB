const express = require('express');
const cors = require('cors');
const photoRoutes = require('./routes/photoRoutes');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173', // your React app URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', photoRoutes);
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
