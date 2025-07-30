require('dotenv').config();
const express = require('express');
const analyzeTextRoutes = require('./routes/analyzeText.routes');

const app = express();

app.use(express.json());

app.use('/analyze-text', analyzeTextRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

module.exports = app;
