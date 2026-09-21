const express = require('express');
const router = express.Router();
const { getChatReply } = require('../services/geminiService');
const { getPublicBookingSummaries } = require('../services/sheetsService');

const MAX_MESSAGE_LENGTH = 1000;

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{ role: 'user' | 'bot', text: string }> }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a message.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ success: false, message: 'Message is too long.' });
    }

    const bookingSummaries = await getPublicBookingSummaries().catch(() => []);
    const reply = await getChatReply(message.trim(), history, bookingSummaries);
    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(200).json({
      success: true,
      reply: "Sorry, I'm having trouble connecting right now. Please try again, or reach Mrs S Gowri directly at +91 70107 75902."
    });
  }
});

module.exports = router;
