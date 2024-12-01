const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const miningRoutes = require('./routes/miningRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files statically
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/mining', miningRoutes);

app.get('/', async(req,res)=>{
  res.send('Gain is connected')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});