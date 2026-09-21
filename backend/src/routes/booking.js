const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { checkAvailability, createBookingEvent } = require('../services/calendarService');
const { appendBookingRow, findOverlappingBookingForContact } = require('../services/sheetsService');
const { sendOwnerNotification } = require('../services/gmailService');

const ROOM_TYPES = ['2bhk', '1bhk'];
const NAME_RE = /^[\p{L}\p{N} .'-]{2,100}$/u;
const PHONE_RE = /^[0-9+ ()-]{8,18}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Matches the website's guest dropdown: 1-14, or "15" optionally with a trailing "+".
const GUESTS_RE = /^(?:1[0-4]|[1-9]|15\+?)$/;

// Reject control characters (CR/LF etc.) so guest input can never inject
// extra headers/lines into the RFC 2822 email or corrupt downstream records.
function hasControlChars(value) {
  return /[\r\n\t\0]/.test(value);
}

function validateBooking(body) {
  const errors = [];
  const { name, phone, email, roomType, checkIn, checkOut, guests } = body || {};

  if (typeof name !== 'string' || hasControlChars(name) || !NAME_RE.test(name.trim())) {
    errors.push('Please provide a valid full name (2-100 characters).');
  }
  if (typeof phone !== 'string' || hasControlChars(phone) || !PHONE_RE.test(phone.trim())) {
    errors.push('Please provide a valid phone number.');
  }
  if (typeof email !== 'string' || hasControlChars(email) || email.length > 255 || !EMAIL_RE.test(email.trim())) {
    errors.push('Please provide a valid email address.');
  }
  if (typeof roomType !== 'string' || !ROOM_TYPES.includes(roomType)) {
    errors.push(`Room type must be one of: ${ROOM_TYPES.join(', ')}.`);
  }
  if (typeof checkIn !== 'string' || !DATE_RE.test(checkIn) || Number.isNaN(new Date(checkIn).getTime())) {
    errors.push('Check-in must be a valid date (YYYY-MM-DD).');
  }
  if (typeof checkOut !== 'string' || !DATE_RE.test(checkOut) || Number.isNaN(new Date(checkOut).getTime())) {
    errors.push('Check-out must be a valid date (YYYY-MM-DD).');
  }
  if (guests !== undefined && guests !== null) {
    const guestsStr = String(guests).trim();
    if (!GUESTS_RE.test(guestsStr)) {
      errors.push('Guests must be a number between 1 and 20.');
    }
  }

  return errors;
}

function generateBookingId() {
  return `bk_${Date.now().toString(36)}${crypto.randomBytes(4).toString('hex')}`;
}

/**
 * POST /api/book
 * Body: { name, phone, email, roomType, checkIn, checkOut, guests }
 */
router.post('/book', async (req, res) => {
  try {
    // Honeypot anti-bot field: real guests never see or fill this input (it's
    // hidden off-screen on the form); a filled value means an automated
    // submission, so we reject it with the same generic validation shape
    // used for real errors rather than tipping off the bot with a distinct response.
    if (typeof req.body?.company === 'string' && req.body.company.trim() !== '') {
      return res.status(400).json({
        success: false,
        message: 'We could not process that request. Please try again.'
      });
    }

    const validationErrors = validateBooking(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors
      });
    }

    const name = req.body.name.trim();
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const roomType = req.body.roomType;
    const checkIn = req.body.checkIn;
    const checkOut = req.body.checkOut;
    const guests = req.body.guests !== undefined && req.body.guests !== null ? String(req.body.guests).trim() : '1';

    const todayStr = new Date().toISOString().slice(0, 10);
    if (checkIn < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past.'
      });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.'
      });
    }

    // Step 1: Block the same guest (matched by email or phone) from holding
    // two bookings that overlap the same dates — prevents accidental
    // duplicate submissions and deliberate double-booking abuse.
    const existingBooking = await findOverlappingBookingForContact({ email, phone, checkIn, checkOut });
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `You already have a booking for overlapping dates (${existingBooking.checkIn} to ${existingBooking.checkOut}, Booking ID: ${existingBooking.bookingId}). Please contact the host directly to change an existing reservation.`
      });
    }

    // Step 2: Re-validate dates against Calendar API
    const isAvailable = await checkAvailability(roomType, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: `The selected dates (${checkIn} to ${checkOut}) for ${roomType.toUpperCase()} are no longer available. Please select another date range.`
      });
    }

    // Generate Booking ID
    const bookingId = generateBookingId();

    const bookingData = {
      bookingId,
      name,
      phone,
      email,
      roomType,
      checkIn,
      checkOut,
      guests,
      status: 'Confirmed'
    };

    // Steps 3-5: Sheet row, Calendar event, and owner email all fire together
    // rather than one after another — each service already catches its own
    // errors and falls back internally, so none of them can block the others.
    await Promise.all([
      appendBookingRow(bookingData),
      createBookingEvent(bookingData),
      sendOwnerNotification({
        bookingId,
        roomType,
        checkIn,
        checkOut,
        name,
        phone,
        email,
        guests: bookingData.guests
      })
    ]);

    // Owner Contact Info from Environment Variables
    const ownerPhone = process.env.OWNER_PHONE || '+917010775902';
    const ownerEmail = process.env.OWNER_EMAIL || 'rgnshomestay@gmail.com';

    // Step 6: Return Success Response
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
      message: 'Internal server error while processing booking request.'
    });
  }
});

module.exports = router;
