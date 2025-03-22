const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();
const app = express();

connectDB();

// CORS setup (allow credentials)
app.use(cors({ 
  origin: ['http://localhost:5173'], // Frontend URL
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',  () => console.log(`Server running on port ${PORT}`));
