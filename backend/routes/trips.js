const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/trips
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT trips.*, destinations.name, destinations.image, destinations.description
      FROM trips
      JOIN destinations ON trips.destination_id = destinations.id
      ORDER BY trips.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// POST /api/trips
router.post('/', async (req, res) => {
  const { destination_id, title, start_date, end_date, status } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO trips (destination_id, title, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [destination_id, title, start_date, end_date, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add trip' });
  }
});

// PUT /api/trips/:id
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, start_date, end_date, status } = req.body;

  try {
    const result = await db.query(
      `UPDATE trips
       SET title = $1, start_date = $2, end_date = $3, status = $4
       WHERE id = $5
       RETURNING *`,
      [title, start_date, end_date, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await db.query('DELETE FROM trips WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

module.exports = router;
