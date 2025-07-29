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


// POST /api/destinations/:id/click
router.post('/:id/click', async (req, res) => {
  const { id } = req.params;
  try {
    // Εισαγωγή νέου click στον πίνακα destination_clicks
    await db.query(
      'INSERT INTO destination_clicks (destination_id) VALUES ($1)',
      [id]
    );

    // Το trigger θα ενημερώσει αυτόματα τον πίνακα destinations
    const updated = await db.query(
      'SELECT * FROM destinations WHERE id = $1',
      [id]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record click' });
  }
});

// GET /api/destinations/:id/clicks
router.get('/:id/clicks', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT d.id, d.name, COUNT(c.id) AS clicks_last_30_days
      FROM public.destinations d
      LEFT JOIN public.destination_clicks c 
        ON d.id = c.destination_id 
        AND c.click_date >= (CURRENT_DATE - INTERVAL '30 days')
      WHERE d.id = $1
      GROUP BY d.id, d.name;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch click stats' });
  }
});

// GET /api/destinations/:id/clicks/daily
router.get('/:id/clicks/daily', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT
        DATE(c.click_date) AS day,
        COUNT(*) AS clicks
      FROM public.destination_clicks c
      WHERE c.destination_id = $1
        AND c.click_date >= (CURRENT_DATE - INTERVAL '30 days')
      GROUP BY day
      ORDER BY day ASC;
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily click stats' });
  }
});


module.exports = router;
