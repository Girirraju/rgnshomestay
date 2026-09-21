const { google } = require('googleapis');
const {
  getOAuth2Client,
  isServiceAccountConfigured,
  getServiceAccountAuth,
  isCalendarServiceAccountConfigured,
  getCalendarServiceAccountAuth
} = require('./googleAuth');

// Prefers a calendar-only service account (GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL /
// GOOGLE_CALENDAR_PRIVATE_KEY) when configured, so Calendar credentials can be
// swapped independently of the Sheets-writing service account.
function getCalendarAuth() {
  if (isCalendarServiceAccountConfigured()) return getCalendarServiceAccountAuth();
  return isServiceAccountConfigured() ? getServiceAccountAuth() : getOAuth2Client();
}

// In-memory mock storage for development/testing when live Google credentials are not set
const mockBookings = [
  { roomType: '2bhk', start: '2026-09-20', end: '2026-09-23' },
  { roomType: '1bhk', start: '2026-09-15', end: '2026-09-18' }
];

function normalizeRoomType(roomType) {
  if (!roomType) return '2bhk';
  const str = String(roomType).toLowerCase().trim();
  if (str.includes('2bhk')) return '2bhk';
  if (str.includes('1bhk')) return '1bhk';
  return str;
}

/**
 * Fetch booked date ranges for a given roomType.
 */
async function getBookedDateRanges(roomType) {
  const normalized = normalizeRoomType(roomType);
  const auth = getCalendarAuth();
  
  if (!auth) {
    console.log(`[CalendarService] Google Auth not configured. Returning mock bookings for ${normalized}.`);
    return mockBookings
      .filter(b => b.roomType === normalized)
      .map(({ start, end }) => ({ start, end }));
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.OWNER_CALENDAR_ID || 'primary';
    
    // Fetch events from today onwards
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    
    const ranges = events
      .filter(event => {
        if (event.status === 'cancelled') return false;
        const summary = (event.summary || '').toLowerCase();
        const description = (event.description || '').toLowerCase();
        // Match room type or include all events if no specific tag
        return summary.includes(normalized) || description.includes(normalized) || summary.includes('booking');
      })
      .map(event => {
        const start = event.start.date || (event.start.dateTime ? event.start.dateTime.split('T')[0] : null);
        const end = event.end.date || (event.end.dateTime ? event.end.dateTime.split('T')[0] : null);
        return { start, end };
      })
      .filter(r => r.start && r.end);

    return ranges;
  } catch (error) {
    console.error('[CalendarService] Error listing calendar events:', error.message);
    // Fallback to mock data on API error to prevent server crash
    return mockBookings
      .filter(b => b.roomType === normalized)
      .map(({ start, end }) => ({ start, end }));
  }
}

/**
 * Check if dates overlap with existing calendar events
 */
async function checkAvailability(roomType, checkIn, checkOut) {
  const booked = await getBookedDateRanges(roomType);
  
  const reqStart = new Date(checkIn).getTime();
  const reqEnd = new Date(checkOut).getTime();

  for (const range of booked) {
    const bStart = new Date(range.start).getTime();
    const bEnd = new Date(range.end).getTime();

    // Overlap condition: reqStart < bEnd && reqEnd > bStart
    if (reqStart < bEnd && reqEnd > bStart) {
      return false; // Not available
    }
  }

  return true; // Available
}

/**
 * Create a Google Calendar event for the confirmed booking
 */
async function createBookingEvent({ roomType, name, phone, email, checkIn, checkOut, guests }) {
  const normalized = normalizeRoomType(roomType).toUpperCase();
  const auth = getCalendarAuth();

  const eventPayload = {
    summary: `${normalized} Booking - ${name}`,
    description: `RGN's Homestay Booking Details:
Host: Mrs S Gowri
Guest Name: ${name}
Phone: ${phone}
Email: ${email}
Room Type: ${normalized}
Check-in: ${checkIn} (2:00 PM)
Check-out: ${checkOut} (2:00 PM)
Guests: ${guests}
Status: Confirmed`,
    start: { date: checkIn },
    end: { date: checkOut }
  };

  if (!auth) {
    console.log('[CalendarService] Google Auth not configured. Simulating Calendar Event creation:', eventPayload);
    // Save to mock storage so subsequent GET calls reflect this booking
    mockBookings.push({
      roomType: normalizeRoomType(roomType),
      start: checkIn,
      end: checkOut
    });
    return { id: `mock_evt_${Date.now()}`, ...eventPayload };
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.OWNER_CALENDAR_ID || 'primary';

    const response = await calendar.events.insert({
      calendarId,
      requestBody: eventPayload
    });

    console.log('[CalendarService] Calendar event created successfully:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('[CalendarService] Error creating calendar event:', error.message);
    // Store in mock on error so booking process continues
    mockBookings.push({
      roomType: normalizeRoomType(roomType),
      start: checkIn,
      end: checkOut
    });
    return { id: `fallback_evt_${Date.now()}`, ...eventPayload };
  }
}

module.exports = {
  getBookedDateRanges,
  checkAvailability,
  createBookingEvent
};
