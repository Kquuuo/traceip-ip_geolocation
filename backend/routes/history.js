const express = require('express');
const { query } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM search_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    return res.json({ history: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', async (req, res) => {
  const { ip_address, city, region, country, org, lat, lon, timezone } = req.body;

  if (!ip_address) {
    return res.status(400).json({ message: 'IP address is required.' });
  }

  try {
    const existing = await query(
      'SELECT id FROM search_history WHERE user_id = $1 AND ip_address = $2',
      [req.user.id, ip_address]
    );

    if (existing.rows.length > 0) {
      const updated = await query(
        `UPDATE search_history
         SET city=$1, region=$2, country=$3, org=$4, lat=$5, lon=$6, timezone=$7, created_at=NOW()
         WHERE id=$8 RETURNING *`,
        [city, region, country, org, lat, lon, timezone, existing.rows[0].id]
      );
      return res.json({ history: updated.rows[0], updated: true });
    }

    const result = await query(
      `INSERT INTO search_history (user_id, ip_address, city, region, country, org, lat, lon, timezone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, ip_address, city, region, country, org, lat, lon, timezone]
    );
    return res.status(201).json({ history: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'An array of IDs is required.' });
  }

  try {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const result = await query(
      `DELETE FROM search_history WHERE id IN (${placeholders}) AND user_id = $${ids.length + 1}`,
      [...ids, req.user.id]
    );
    return res.json({ message: `${result.rowCount} record(s) deleted.`, deleted: result.rowCount });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM search_history WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Record not found.' });
    return res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;