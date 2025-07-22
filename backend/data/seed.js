const db = require('../db');
const destinations = require('../destinations_data');

async function seed() {
  for (const d of destinations) {
    await db.query(
      `INSERT INTO destinations 
        (name, tagline, description, attractions, rating, cuisine, best_time, currency, language, cost, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        d.name,
        d.tagline,
        d.description,
        d.attractions,
        d.rating,
        d.cuisine,
        d.tripInfo.bestTime,
        d.tripInfo.currency,
        d.tripInfo.language,
        d.tripInfo.cost,
        d.image,
      ]
    );
  }

  console.log('✅ Data inserted');
  process.exit();
}

seed().catch(err => {
  console.error('❌ Error inserting data:', err);
  process.exit(1);
});
