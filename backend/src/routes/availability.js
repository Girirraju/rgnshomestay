const express = require('express');
const router = express.Router();
const { getBookedDateRanges } = require('../services/calendarService');

/**
 * GET /api/booked-dates?roomType=2bhk
 * Returns array of booked date ranges for the specified room type.
 */
router.get('/booked-dates', async (req, res) => {
  try {
    const roomType = req.query.roomType || '2bhk';
    const bookedRanges = await getBookedDateRanges(roomType);
    
    return res.status(200).json({
      success: true,
      roomType,
      bookedRanges
    });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booked dates',
      bookedRanges: []
    });
  }
});

module.exports = router;
