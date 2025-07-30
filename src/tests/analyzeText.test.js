const request = require('supertest');
const app = require('../app');
const axios = require('axios');
const { extractWordsFrequency } = require('../utils/textUtils');

jest.mock('axios'); 


describe('API /analyze-text', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: [[
        { label: '5 stars', score: 0.7 },
        { label: '4 stars', score: 0.2 },
        { label: '3 stars', score: 0.1 }
      ]]
    });
  });

  describe('POST /analyze-text', () => {
    it('deve retornar totalPalavras, palavrasMaisFrequentes e sentimento', async () => {
      const texto = "Obrigada, estou feliz por participar deste processo seletivo!";

      const res = await request(app)
        .post('/analyze-text')
        .send({ text: texto })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(typeof res.body.totalPalavras).toBe('number');
      expect(Array.isArray(res.body.palavrasMaisFrequentes)).toBe(true);
      expect(typeof res.body.sentimento).toBe('string');
      expect(['positivo', 'negativo', 'neutro']).toContain(res.body.sentimento);
      expect(res.body.palavrasMaisFrequentes.length).toBeLessThanOrEqual(5);

      const palavras = res.body.palavrasMaisFrequentes.map(p => p.word);
      expect(palavras).toContain('feliz');
    });

    it('deve retornar erro 400 se texto estiver ausente ou inválido', async () => {
      const res = await request(app)
        .post('/analyze-text')
        .send({ text: null });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /analyze-text/search-term', () => {
    it('deve retornar 400 se o parâmetro "term" não for informado', async () => {
      const res = await request(app).get('/analyze-text/search-term');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve retornar true se o termo foi encontrado na última análise', async () => {
      await request(app)
        .post('/analyze-text')
        .send({ text: 'Teste para buscar termo feliz' });

      const res = await request(app)
        .get('/analyze-text/search-term')
        .query({ term: 'feliz' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ termo: 'feliz', encontrado: true });
    });

    it('deve retornar 404 se o termo não for encontrado', async () => {
      await request(app)
        .post('/analyze-text')
        .send({ text: 'Apenas palavras comuns aqui' });

      const res = await request(app)
        .get('/analyze-text/search-term')
        .query({ term: 'inexistente' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ termo: 'inexistente', encontrado: false });
    });
  });
});



describe('Função extractWordsFrequency', () => {
  it('deve contar corretamente o total de palavras', () => {
    const texto = 'Hoje é um ótimo dia para aprender e programar com alegria!';
    const resultado = extractWordsFrequency(texto);
    expect(resultado.totalWords).toBe(11);
  });

  it('deve ignorar stopwords na frequência', () => {
    const texto = 'Eu gosto de estudar e eu gosto de programar';
    const resultado = extractWordsFrequency(texto);
    const palavras = resultado.topWords.map(p => p.word);

    expect(palavras).toContain('gosto');
    expect(palavras).toContain('estudar');
    expect(palavras).toContain('programar');
    expect(palavras).not.toContain('eu');
    expect(palavras).not.toContain('de');
  });

  it('deve retornar no máximo 5 palavras mais frequentes', () => {
    const texto = 'um dois três quatro cinco seis sete oito nove dez';
    const resultado = extractWordsFrequency(texto);
    expect(resultado.topWords.length).toBeLessThanOrEqual(5);
  });

  it('deve lidar com letras acentuadas', () => {
    const texto = 'ação educação coração maçã café';
    const resultado = extractWordsFrequency(texto);
    const palavras = resultado.topWords.map(p => p.word);
    expect(palavras).toEqual(expect.arrayContaining(['ação', 'educação', 'coração', 'maçã', 'café']));
  });

  it('deve retornar mapa de frequência correto', () => {
    const texto = 'felicidade alegria felicidade paz alegria';
    const resultado = extractWordsFrequency(texto);

    expect(resultado.freqMap['felicidade']).toBe(2);
    expect(resultado.freqMap['alegria']).toBe(2);
    expect(resultado.freqMap['paz']).toBe(1);
  });

  it('deve retornar vazio corretamente para texto sem palavras', () => {
    const resultado = extractWordsFrequency('');
    expect(resultado.totalWords).toBe(0);
    expect(resultado.topWords).toEqual([]);
    expect(resultado.freqMap).toEqual({});
  });
});
