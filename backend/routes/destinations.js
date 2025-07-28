const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/destinations
router.get('/', async (req, res) => {
  console.log('📥 GET /api/destinations received');
  try {
    const result = await db.query('SELECT * FROM destinations ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Query failed:', err); // <== ΕΔΩ!
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM destinations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// Update clicks
router.post('/:id/click', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE destinations SET clicks = clicks + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update clicks' });
  }
});

module.exports = router;
