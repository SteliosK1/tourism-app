const db = require('../db'); // αν βρίσκεται στον ίδιο φάκελο
const destinations = require('../destinations_data');

async function seed() {
  for (const d of destinations) {
    const query = `
      INSERT INTO destinations 
        (name, tagline, description, attractions, rating, cuisine, trip_info, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const values = [
      d.name,
      d.tagline,
      d.description,
      d.attractions,
      d.rating,
      d.cuisine,
      d.tripInfo, // το JSON αντικείμενο
      d.image
    ];

    try {
      await db.query(query, values);
      console.log(`✅ Inserted: ${d.name}`);
    } catch (err) {
      console.error(`❌ Error inserting ${d.name}:`, err.message);
    }
  }

  await db.end();
  console.log("✅ All destinations inserted.");
}

seed();
