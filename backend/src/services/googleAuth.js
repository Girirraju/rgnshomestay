const { google } = require('googleapis');
require('dotenv').config();

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
  getOAuth2Client
};
