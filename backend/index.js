const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// ✅ routes
console.log('📦 Loading destinations routes...');
const destinationsRoutes = require('./routes/destinations');
console.log('📦 Loading trips routes...');
const tripsRoutes = require('./routes/trips');

app.use('/api/destinations', destinationsRoutes);
app.use('/api/trips', tripsRoutes);

// ✅ start server
console.log('✅ Express app loaded successfully');
app.listen(process.env.PORT || 5050, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
