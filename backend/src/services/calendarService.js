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

// The house has two bedroom units: a 2BHK booking takes both (whole home),
// a 1BHK booking takes one. A night is full once both units are taken.
const HOUSE_UNITS = 2;
function unitsFor(roomType) {
  return normalizeRoomType(roomType) === '1bhk' ? 1 : 2;
}

/**
 * All active bookings as { start, end, units }. Calendar events are matched
 * by "2bhk"/"1bhk"/"booking" in the title or description; an event that
 * doesn't name a room type is treated as the whole home (safe default).
 */
async function getBookings() {
  const auth = getCalendarAuth();
  const fromMock = () => mockBookings.map(b => ({ start: b.start, end: b.end, units: unitsFor(b.roomType) }));

  if (!auth) {
    console.log('[CalendarService] Google Auth not configured. Using mock bookings.');
    return fromMock();
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

    return (response.data.items || [])
      .filter(event => event.status !== 'cancelled')
      .map(event => {
        const text = `${event.summary || ''} ${event.description || ''}`.toLowerCase();
        let units = 0;
        if (text.includes('2bhk')) units = 2;
        else if (text.includes('1bhk')) units = 1;
        else if (text.includes('booking')) units = 2;
        const start = event.start.date || (event.start.dateTime ? event.start.dateTime.split('T')[0] : null);
        const end = event.end.date || (event.end.dateTime ? event.end.dateTime.split('T')[0] : null);
        return { start, end, units };
      })
      .filter(r => r.units > 0 && r.start && r.end);
  } catch (error) {
    console.error('[CalendarService] Error listing calendar events:', error.message);
    // Fallback to mock data on API error to prevent server crash
    return fromMock();
  }
}

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Map of night (YYYY-MM-DD) -> units already taken that night.
function unitsByNight(bookings) {
  const nights = new Map();
  for (const { start, end, units } of bookings) {
    for (let day = start; day < end; day = addDays(day, 1)) {
      nights.set(day, (nights.get(day) || 0) + units);
    }
  }
  return nights;
}

/**
 * Date ranges on which `roomType` can NOT be booked, merged into
 * consecutive { start, end } ranges (end exclusive, like calendar events).
 */
async function getBookedDateRanges(roomType) {
  const needed = unitsFor(roomType);
  const nights = unitsByNight(await getBookings());
  const blocked = [...nights.entries()]
    .filter(([, used]) => used + needed > HOUSE_UNITS)
    .map(([day]) => day)
    .sort();

  const ranges = [];
  for (const day of blocked) {
    const last = ranges[ranges.length - 1];
    if (last && last.end === day) last.end = addDays(day, 1);
    else ranges.push({ start: day, end: addDays(day, 1) });
  }
  return ranges;
}

/**
 * Check every night of the requested stay has enough free units
 */
async function checkAvailability(roomType, checkIn, checkOut) {
  const needed = unitsFor(roomType);
  const nights = unitsByNight(await getBookings());
  for (let day = checkIn; day < checkOut; day = addDays(day, 1)) {
    if ((nights.get(day) || 0) + needed > HOUSE_UNITS) return false;
  }
  return true;
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
