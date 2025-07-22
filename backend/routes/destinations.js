const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('✅ destinations route loaded');

router.get('/', async (req, res) => {
  console.log('👉 GET /api/destinations called');
  try {
    const result = await db.query('SELECT * FROM destinations');
    res.status(200).json(result.rows);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Database error' });
    }
    console.error('❌ DB error:', err);
  }
});

module.exports = router;
