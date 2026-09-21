const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/booking');
const chatRoutes = require('./routes/chat');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Security headers. This is a JSON-only API (no HTML views), so the default
// script/style CSP directives don't apply — but we do need cross-origin
// responses readable by the separately-hosted frontend, which CORS below
// already gates by allowlist.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS: only origins explicitly listed in CORS_ORIGINS may call this API.
// In production, an unset CORS_ORIGINS means "block all cross-origin
// requests" (safe default) rather than "allow every origin". In
// non-production it falls back to allow-all for local-dev convenience.
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
if (isProduction && allowedOrigins.length === 0) {
  console.warn('[Security] CORS_ORIGINS is not set. In production this blocks ALL cross-origin requests by default — set CORS_ORIGINS to your frontend URL(s).');
}
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : !isProduction,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Cap request body size — booking/chat payloads are small; this blocks
// oversized-payload abuse before it reaches route handlers.
app.use(express.json({ limit: '15kb' }));

// Rate limiters default to express-rate-limit's built-in in-memory store,
// which only counts requests handled by that one warm process — fine for a
// single long-running server, but on Vercel each serverless invocation can
// land on a different (or freshly cold) instance, so counts wouldn't
// actually be shared. If REDIS_URL is set (e.g. a free Upstash database),
// limits are enforced against that shared store instead; without it, this
// silently falls back to in-memory (correct for local dev / a normal server).
let redisClient;
if (process.env.REDIS_URL) {
  const Redis = require('ioredis');
  redisClient = new Redis(process.env.REDIS_URL);
  redisClient.on('error', (err) => console.error('[RateLimit] Redis connection error:', err.message));
}

// One shared Redis connection, but each limiter needs its own RedisStore
// instance (it namespaces keys internally) — RedisStore itself is cheap to
// construct, so this doesn't open extra connections.
function buildRateLimitStore() {
  if (!redisClient) return undefined;
  const { RedisStore } = require('rate-limit-redis');
  return new RedisStore({ sendCommand: (...args) => redisClient.call(...args) });
}

// Baseline rate limit across the whole API, on top of the stricter
// per-route limiters below, so no endpoint (including health/availability
// checks) can be hammered without limit.
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRateLimitStore(),
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api', globalLimiter);

// Rate limit booking submissions to prevent spam/abuse of the Google API quota
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRateLimitStore(),
  message: { success: false, message: 'Too many booking attempts. Please try again later.' }
});
app.use('/api/book', bookingLimiter);

// Rate limit chat messages to protect the Gemini API quota
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRateLimitStore(),
  message: { success: false, message: 'Too many messages. Please wait a moment and try again.' }
});
app.use('/api/chat', chatLimiter);

// API Routes
app.use('/api', availabilityRoutes);
app.use('/api', bookingRoutes);
app.use('/api', chatRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: "RGN's Homestay Booking API",
    timestamp: new Date().toISOString()
  });
});

// This server is API-only. The frontend (rgn-homestyle-retreat-main) runs as its own app.
app.get('/', (req, res) => {
  res.status(200).json({
    service: "RGN's Homestay Booking API",
    message: 'This is the backend API. The website frontend runs separately.'
  });
});

// Unmatched /api/* routes get a plain JSON 404 instead of Express's default HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

// Centralized error handler — never leak stack traces or internal error
// details to the client, regardless of what threw or where.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request payload too large.' });
  }
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Only bind a listening port when this file is run directly (`node
// src/index.js` / `npm start`). When it's `require()`'d instead — by a
// serverless entry point such as api/index.js on Vercel — module.exports
// below is all that's used, and the platform handles invoking the app per
// request without a persistent listener.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏡 RGN's Homestay Fullstack Server listening on port ${PORT}`);
    console.log(`👉 Web Portal: http://localhost:${PORT}/`);
    console.log(`👉 Availability API: http://localhost:${PORT}/api/booked-dates?roomType=2bhk`);
    console.log(`👉 Booking API: http://localhost:${PORT}/api/book`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
