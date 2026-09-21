// Vercel serverless entry point. Vercel invokes any exported request handler
// found under /api per-request; an Express app works directly as one
// (app(req, res)), so this just re-exports the app built in src/index.js —
// no route/logic duplication.
module.exports = require('../src/index.js');
