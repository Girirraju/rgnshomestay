const { google } = require('googleapis');
const { getOAuth2Client } = require('./googleAuth');

/**
 * Sends a notification email to the owner via Gmail API.
 * Content requirement: room type, check-in date, check-out date, check-in/out time.
 */
async function sendOwnerNotification({ roomType, checkIn, checkOut, name, phone, email, guests }) {
  const auth = getOAuth2Client();
  const ownerEmail = process.env.OWNER_EMAIL || 'rgnshomestay@gmail.com';
  const formattedRoomType = String(roomType).toUpperCase();

  const checkInTime = '2:00 PM';
  const checkOutTime = '2:00 PM';

  const emailSubject = `New Booking: ${formattedRoomType} - Mrs S Gowri (Host)`;
  
  // RFC 2822 email format containing required details
  const emailLines = [
    `To: ${ownerEmail}`,
    `Subject: ${emailSubject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    `Room Type: ${formattedRoomType}`,
    `Check-in Date: ${checkIn}`,
    `Check-out Date: ${checkOut}`,
    `Check-in Time: ${checkInTime}`,
    `Check-out Time: ${checkOutTime}`,
    `Guest Name: ${name || 'Valued Guest'}`,
    `Phone: ${phone || 'N/A'}`,
    `Email: ${email || 'N/A'}`,
    `Guests: ${guests || 1}`
  ];

  const rawMessage = emailLines.join('\r\n');

  if (!auth) {
    console.log('[GmailService] Google Auth not configured. Simulating email notification to owner (Mrs S Gowri):');
    console.log(rawMessage);
    return { success: true, mode: 'mock', ownerEmail };
  }

  try {
    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const gmail = google.gmail({ version: 'v1', auth });

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log('[GmailService] Notification email sent successfully via Gmail API. Message ID:', response.data.id);
    return { success: true, mode: 'live', id: response.data.id };
  } catch (error) {
    console.error('[GmailService] Error sending email via Gmail API:', error.message);
    return { success: true, mode: 'fallback', error: error.message };
  }
}

module.exports = {
  sendOwnerNotification
};
