const { google } = require('googleapis');
const { getOAuth2Client, isServiceAccountConfigured, getServiceAccountAuth } = require('./googleAuth');

const mockSheetRows = [];

/**
 * Append a booking row to the Google Sheet database.
 */
async function appendBookingRow({ bookingId, name, phone, email, roomType, checkIn, checkOut, guests, status = 'Confirmed' }) {
  const auth = isServiceAccountConfigured() ? getServiceAccountAuth() : getOAuth2Client();
  const sheetId = process.env.SHEET_ID;

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const formattedRoomType = String(roomType).toUpperCase();

  const rowValues = [
    timestamp,
    bookingId,
    name,
    phone,
    email,
    formattedRoomType,
    checkIn,
    checkOut,
    guests,
    status
  ];

  if (!auth || !sheetId || sheetId.startsWith('your-')) {
    console.log('[SheetsService] Google Auth or SHEET_ID not configured. Appending to mock sheet rows:', rowValues);
    mockSheetRows.push(rowValues);
    rawRowCache = { data: null, fetchedAt: 0 };
    return { success: true, mode: 'mock', row: rowValues };
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:J',
      // RAW (not USER_ENTERED): guest-supplied fields are stored as literal text,
      // never parsed as formulas — prevents spreadsheet formula injection
      // (e.g. a guest name of "=IMPORTXML(...)" would otherwise execute).
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowValues]
      }
    });

    console.log('[SheetsService] Booking row appended successfully to Google Sheet.');
    rawRowCache = { data: null, fetchedAt: 0 };
    return { success: true, mode: 'live', response: response.data };
  } catch (error) {
    console.error('[SheetsService] Error appending row to Google Sheet:', error.message);
    mockSheetRows.push(rowValues);
    rawRowCache = { data: null, fetchedAt: 0 };
    return { success: true, mode: 'fallback', error: error.message };
  }
}

function rowToRecord(row) {
  const [timestamp, bookingId, name, phone, email, roomType, checkIn, checkOut, guests, status] = row;
  if (!name || !checkIn || !checkOut) return null;
  return {
    timestamp,
    bookingId,
    name: String(name).trim(),
    phone: phone ? String(phone).trim() : '',
    email: email ? String(email).trim() : '',
    roomType: String(roomType || '').trim(),
    checkIn,
    checkOut,
    guests,
    status: status || ''
  };
}

// Short-lived cache so every chat message / booking attempt doesn't trigger a
// fresh Sheets API call. `fresh: true` callers (the duplicate-booking check)
// bypass this to minimize the race window at the moment of booking.
let rawRowCache = { data: null, fetchedAt: 0 };
const RAW_ROW_CACHE_TTL_MS = 30 * 1000;

/**
 * Read every booking row from the sheet (or mock store) as full records
 * (including phone/email). Internal use only — never pass the result of this
 * function to the chatbot; use getPublicBookingSummaries for that.
 */
async function fetchRawRows({ fresh = false } = {}) {
  const now = Date.now();
  if (!fresh && rawRowCache.data && now - rawRowCache.fetchedAt < RAW_ROW_CACHE_TTL_MS) {
    return rawRowCache.data;
  }

  const auth = isServiceAccountConfigured() ? getServiceAccountAuth() : getOAuth2Client();
  const sheetId = process.env.SHEET_ID;

  let records;

  if (!auth || !sheetId || sheetId.startsWith('your-')) {
    records = mockSheetRows.map(rowToRecord).filter(Boolean);
  } else {
    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:J'
      });
      const rows = response.data.values || [];
      records = rows
        .filter((row) => row[0] !== 'Timestamp') // skip an optional header row
        .map(rowToRecord)
        .filter(Boolean);
    } catch (error) {
      console.error('[SheetsService] Error reading Google Sheet:', error.message);
      records = mockSheetRows.map(rowToRecord).filter(Boolean);
    }
  }

  rawRowCache = { data: records, fetchedAt: now };
  return records;
}

function isActive(record) {
  return String(record.status || '').toLowerCase() !== 'cancelled';
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

// Compare by the last 10 digits so "+91 98765 43210", "9876543210", and
// "098765-43210" are all recognized as the same contact.
function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.slice(-10);
}

/**
 * Read the booking sheet and return only the fields that are safe to hand to the
 * chatbot: guest name, room type, and stay dates. Phone, email, and booking ID
 * are intentionally left out of this projection so they can never reach the LLM
 * (and therefore can never leak in a chat reply), regardless of prompting.
 */
async function getPublicBookingSummaries() {
  const records = await fetchRawRows();
  const summaries = records
    .filter(isActive)
    .map(({ name, roomType, checkIn, checkOut }) => ({ name, roomType, checkIn, checkOut }))
    // Cap so the chat prompt doesn't grow unbounded as the sheet fills up.
    .slice(-100);
  return summaries;
}

/**
 * Anti-duplicate-booking check: does this guest (matched by email OR phone —
 * either is enough, since guests sometimes reuse one but not the other)
 * already hold an active booking whose dates overlap the requested stay?
 * Used to block a guest from double-booking themselves for the same dates.
 */
async function findOverlappingBookingForContact({ email, phone, checkIn, checkOut }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const records = await fetchRawRows({ fresh: true });

  return records.find((record) => {
    if (!isActive(record)) return false;
    const sameContact =
      (normalizedEmail && normalizeEmail(record.email) === normalizedEmail) ||
      (normalizedPhone && normalizePhone(record.phone) === normalizedPhone);
    if (!sameContact) return false;
    return rangesOverlap(checkIn, checkOut, record.checkIn, record.checkOut);
  }) || null;
}

module.exports = {
  appendBookingRow,
  getPublicBookingSummaries,
  findOverlappingBookingForContact
};
