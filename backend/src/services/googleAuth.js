const { google } = require('googleapis');
require('dotenv').config();

function isServiceAccountConfigured() {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
  return Boolean(GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY);
}

function getServiceAccountAuth(scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar'
]) {
  if (!isServiceAccountConfigured()) {
    return null;
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes
  });
}

function isCalendarServiceAccountConfigured() {
  const { GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL, GOOGLE_CALENDAR_PRIVATE_KEY } = process.env;
  return Boolean(GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL && GOOGLE_CALENDAR_PRIVATE_KEY);
}

// Separate, calendar-only service account so it can be swapped (e.g. to one
// with access to the owner's personal calendar) without touching the
// Sheets/Calendar-shared account already relied on elsewhere.
function getCalendarServiceAccountAuth() {
  if (!isCalendarServiceAccountConfigured()) {
    return null;
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar']
  });
}

function isGoogleAuthConfigured() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  return Boolean(
    GOOGLE_CLIENT_ID &&
    GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com' &&
    GOOGLE_CLIENT_SECRET &&
    GOOGLE_CLIENT_SECRET !== 'your-google-client-secret' &&
    GOOGLE_REFRESH_TOKEN &&
    GOOGLE_REFRESH_TOKEN !== '1//your-google-refresh-token'
  );
}

function getOAuth2Client() {
  if (!isGoogleAuthConfigured()) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/oauth2callback'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  return oauth2Client;
}

module.exports = {
  isGoogleAuthConfigured,
  getOAuth2Client,
  isServiceAccountConfigured,
  getServiceAccountAuth,
  isCalendarServiceAccountConfigured,
  getCalendarServiceAccountAuth
};
