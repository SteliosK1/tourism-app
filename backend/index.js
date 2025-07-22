const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const destinationsRoute = require('./routes/destinations');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/destinations', destinationsRoute);
// ✅ προσθήκη για serve στα public images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/', (req, res) => {
  res.send('Backend API is running ✅');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
