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

// ✅ NEW ChatBuddy route
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  console.log("📩 Received messages:", messages);
  console.log("🔑 OpenRouter API Key loaded:", !!process.env.OPENROUTER_API_KEY);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'z-ai/glm-4.5-air:free', // ✅ Το δωρεάν μοντέλο που έδειξες
        messages,
      }),
    });

    const data = await response.json();
    console.log("🔍 OpenRouter API Response:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json({ reply: data.choices[0].message });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: 'Chat request failed' });
  }
});

// ✅ start server
console.log('✅ Express app loaded successfully');
app.listen(process.env.PORT || 5050, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
