const nodemailer = require('nodemailer');

/**
 * Sends a booking-confirmation notification to the owner over Gmail SMTP,
 * authenticated with a free Gmail App Password (no Cloud project, no OAuth
 * consent screen, no cost — just the sending Gmail account's own free quota).
 */
function isSmtpConfigured() {
  return Boolean(process.env.GMAIL_APP_PASSWORD && (process.env.GMAIL_SENDER_EMAIL || process.env.OWNER_EMAIL));
}

function getTransporter() {
  const senderEmail = process.env.GMAIL_SENDER_EMAIL || process.env.OWNER_EMAIL;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

async function sendOwnerNotification({ roomType, checkIn, checkOut, name, phone, email, guests, bookingId }) {
  const ownerEmail = process.env.OWNER_EMAIL || 'rgnshomestay@gmail.com';
  const senderEmail = process.env.GMAIL_SENDER_EMAIL || ownerEmail;
  const formattedRoomType = String(roomType).toUpperCase();

  const checkInTime = '2:00 PM';
  const checkOutTime = '2:00 PM';

  const subject = `Booking Confirmed: ${formattedRoomType} — ${name || 'Guest'} (${checkIn} to ${checkOut})`;

  const textBody = [
    `A new booking has been confirmed on RGN's Homestay.`,
    ``,
    `Booking ID: ${bookingId || 'N/A'}`,
    `Room Type: ${formattedRoomType}`,
    `Check-in: ${checkIn} (${checkInTime})`,
    `Check-out: ${checkOut} (${checkOutTime})`,
    ``,
    `Guest Name: ${name || 'Valued Guest'}`,
    `Phone: ${phone || 'N/A'}`,
    `Email: ${email || 'N/A'}`,
    `Guests: ${guests || 1}`
  ].join('\n');

  if (!isSmtpConfigured()) {
    console.log('[GmailService] Gmail App Password not configured. Simulating email notification to owner:');
    console.log(`To: ${ownerEmail}\nSubject: ${subject}\n\n${textBody}`);
    return { success: true, mode: 'mock', ownerEmail };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"RGN's Homestay Bookings" <${senderEmail}>`,
      to: ownerEmail,
      subject,
      text: textBody
    });

    console.log('[GmailService] Notification email sent successfully via Gmail SMTP. Message ID:', info.messageId);
    return { success: true, mode: 'live', id: info.messageId };
  } catch (error) {
    console.error('[GmailService] Error sending email via Gmail SMTP:', error.message);
    return { success: true, mode: 'fallback', error: error.message };
  }
}

module.exports = {
  sendOwnerNotification
};
