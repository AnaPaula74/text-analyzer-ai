# Analisador de Texto com Integração de IA

API que analisa textos e retorna estatísticas básicas e o sentimento, utilizando modelo de inteligência artificial da Hugging Face.

## Tecnologias utilizadas

- Node.js
- Express
- Axios
- dotenv
- Modelo público Hugging Face (nlptown/bert-base-multilingual-uncased-sentiment)

## Como instalar e executar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```

2. Acesse a pasta do projeto:

    ```bash
    cd nome-do-repositorio
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Crie um arquivo .env com o seguinte conteúdo:

    ```bash
    HUGGINGFACE_API_KEY=sua-chave-aqui
    ```
5. Inicie o servidor:

    ```bash
    npm start
    ```

A API estará disponível em http://localhost:3000

## Arquivos importantes

    src/ — Código principal da aplicação

    .env — Contém a chave de API da Hugging Face (não versionado)

    .gitignore — Ignora arquivos sensíveis e dependências

## Endpoints

### POST /analyze-text

Recebe um texto e retorna:

    Total de palavras

    As 5 palavras mais frequentes (sem stopwords)

    O sentimento do texto (positivo, negativo ou neutro)

### GET /search-term?term=...

Verifica se a palavra buscada foi usada na última análise.

This is a challenge by Coodesh
