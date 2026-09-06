const { google } = require('googleapis');
const { getOAuth2Client } = require('./googleAuth');

const mockSheetRows = [];

/**
 * Append a booking row to the Google Sheet database.
 */
async function appendBookingRow({ bookingId, name, phone, email, roomType, checkIn, checkOut, guests, status = 'Confirmed' }) {
  const auth = getOAuth2Client();
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
    return { success: true, mode: 'mock', row: rowValues };
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues]
      }
    });

    console.log('[SheetsService] Booking row appended successfully to Google Sheet.');
    return { success: true, mode: 'live', response: response.data };
  } catch (error) {
    console.error('[SheetsService] Error appending row to Google Sheet:', error.message);
    mockSheetRows.push(rowValues);
    return { success: true, mode: 'fallback', error: error.message };
  }
}

module.exports = {
  appendBookingRow
};
