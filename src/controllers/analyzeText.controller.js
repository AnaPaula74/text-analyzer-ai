const analyzeTextService = require('../services/analyzeText.service');

async function analyzeText(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'O campo "text" é obrigatório e precisa ser uma string.',
      });
    }

    const result = await analyzeTextService.analyzeText(text);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

function searchTerm(req, res) {
  const { term } = req.query;

  if (!term || typeof term !== 'string') {
    return res.status(400).json({
      error: 'O parâmetro "term" é obrigatório e precisa ser uma string.',
    });
  }

  const found = analyzeTextService.searchTermInCache(term);

  return res.status(found ? 200 : 404).json({
    termo: term,
    encontrado: found,
  });
}

module.exports = {
  analyzeText,
  searchTerm,
};
