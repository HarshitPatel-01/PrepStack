const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('PrepStack API is running...');
});

const problemRoutes = require('./routes/problems');
const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');
const visualizeRoutes = require('./routes/visualize');

app.use('/api/problems', problemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/submit', submissionRoutes);
app.use('/api/visualize', visualizeRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prepstack')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
