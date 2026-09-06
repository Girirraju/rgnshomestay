const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', availabilityRoutes);
app.use('/api', bookingRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: "RGN's Homestay Booking API",
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files
const rootDir = path.join(__dirname, '../../');
app.use(express.static(rootDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'code.html'));
});

// Firebase Functions Export setup
try {
  const functions = require('firebase-functions');
  exports.api = functions.https.onRequest(app);
} catch (e) {
  // Firebase functions not loaded (running as standalone Express app)
}

// Local Express Server Execution
if (require.main === module || !process.env.FUNCTION_TARGET) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏡 RGN's Homestay Fullstack Server listening on port ${PORT}`);
    console.log(`👉 Web Portal: http://localhost:${PORT}/`);
    console.log(`👉 Availability API: http://localhost:${PORT}/api/booked-dates?roomType=2bhk`);
    console.log(`👉 Booking API: http://localhost:${PORT}/api/book`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
