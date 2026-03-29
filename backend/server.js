const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/routes', require('./routes/routes'));
app.use('/api/fare', require('./routes/fare'));
app.use('/api/terminals', require('./routes/terminals'));
app.use('/api/reports', require('./routes/reports'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Commute Helper API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
