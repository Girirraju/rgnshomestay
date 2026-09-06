const express = require('express');
const router = express.Router();
const { checkAvailability, createBookingEvent } = require('../services/calendarService');
const { appendBookingRow } = require('../services/sheetsService');
const { sendOwnerNotification } = require('../services/gmailService');

/**
 * POST /api/book
 * Body: { name, phone, email, roomType, checkIn, checkOut, guests }
 */
router.post('/book', async (req, res) => {
  try {
    const { name, phone, email, roomType, checkIn, checkOut, guests } = req.body;

    // Basic Validation
    if (!name || !phone || !email || !roomType || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking parameters: name, phone, email, roomType, checkIn, checkOut.'
      });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.'
      });
    }

    // Step 1: Re-validate dates against Calendar API
    const isAvailable = await checkAvailability(roomType, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: `The selected dates (${checkIn} to ${checkOut}) for ${roomType.toUpperCase()} are no longer available. Please select another date range.`
      });
    }

    // Generate Booking ID
    const bookingId = `bk_${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingData = {
      bookingId,
      name,
      phone,
      email,
      roomType,
      checkIn,
      checkOut,
      guests: guests || 1,
      status: 'Confirmed'
    };

    // Step 2: Append row to Google Sheets
    await appendBookingRow(bookingData);

    // Step 3: Create Google Calendar Event
    await createBookingEvent(bookingData);

    // Step 4: Send notification email via Gmail API
    await sendOwnerNotification({
      roomType,
      checkIn,
      checkOut,
      name,
      phone,
      email,
      guests: bookingData.guests
    });

    // Owner Contact Info from Environment Variables
    const ownerPhone = process.env.OWNER_PHONE || '+917010775902';
    const ownerEmail = process.env.OWNER_EMAIL || 'rgnshomestay@gmail.com';

    // Step 5: Return Success Response
    return res.status(201).json({
      success: true,
      bookingId,
      owner: {
        phone: ownerPhone,
        email: ownerEmail
      }
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing booking request.',
      error: error.message
    });
  }
});

module.exports = router;
