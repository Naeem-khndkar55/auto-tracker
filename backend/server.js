const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const settingsRoutes = require('./routes/settingRoutes')
const { errorHandler } = require('./middleware/errorMiddleware');
const maintenanceMiddleware = require("./middleware/maintenanceMiddleware");

require('dotenv').config();
const app = express();

connectDB();

// CORS setup (allow credentials)
app.use(cors({ 
  origin: [process.env.CLIENT_URL,'*'], // Frontend URL
  //origin: ['*'], // Frontend URL
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(maintenanceMiddleware);

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);
app.use("/api/settings", settingsRoutes);
//app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',  () => console.log(`Server running on port ${PORT}`));
