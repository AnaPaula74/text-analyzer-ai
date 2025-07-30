const stopwordsPt = require('stopwords-pt');
const STOPWORDS_PT = new Set(stopwordsPt);

function extractWordsFrequency(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return {
      totalWords: 0,
      freqMap: {},
      topWords: [],
    };
  }

  const allWords = text.match(/\p{L}+/gu) || [];
  const totalWords = allWords.length;

  const normalized = allWords.map(word => word.toLowerCase());
  const relevantWords = normalized.filter(word => !STOPWORDS_PT.has(word));

  const freqMap = {};
  for (const word of relevantWords) {
    freqMap[word] = (freqMap[word] || 0) + 1;
  }

  const topWords = Object.entries(freqMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    totalWords,
    freqMap,
    topWords,
  };
}

module.exports = {
  extractWordsFrequency,
};
