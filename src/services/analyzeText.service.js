const axios = require('axios');
const { extractWordsFrequency } = require('../utils/textUtils');

const API_URL = 'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment';

let lastAnalysis = null;

function mapSentimentLabel(label) {
  if (!label) return 'desconhecido';

  const score = parseInt(label[0], 10);
  if (isNaN(score)) return 'desconhecido';

  if (score <= 2) return 'negativo';
  if (score === 3) return 'neutro';
  return 'positivo';
}

async function analyzeText(text) {
  const { totalWords, topWords, freqMap } = extractWordsFrequency(text);

  try {
    const response = await axios.post(
      API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    let sentimento = 'desconhecido';

    if (Array.isArray(response.data?.[0])) {
      const scores = response.data[0];
      scores.sort((a, b) => b.score - a.score);
      sentimento = mapSentimentLabel(scores[0].label);
    }

    lastAnalysis = { text, freqMap };

    return {
      totalPalavras: totalWords,
      palavrasMaisFrequentes: topWords,
      sentimento,
    };
  } catch (error) {
    console.error('Erro ao analisar sentimento:', error.message || error);

    lastAnalysis = { text, freqMap };

    return {
      totalPalavras: totalWords,
      palavrasMaisFrequentes: topWords,
      sentimento: 'indefinido',
      error: 'Não foi possível analisar o sentimento no momento.',
    };
  }
}

function searchTermInCache(term) {
  if (!lastAnalysis) return null;
  return !!lastAnalysis.freqMap?.[term.toLowerCase()];
}

module.exports = {
  analyzeText,
  searchTermInCache,
};
