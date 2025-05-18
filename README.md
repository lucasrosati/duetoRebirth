Dueto

Jogo de palavras inspirado no Wordle em duplas. Frontend em React/Tailwind e backend em C com servidor HTTP.

Requisitos atendidos

Backend em C usando libmicrohttpd

Menu interativo em HTML servido pelo backend em C

Estrutura de Dados: lista ligada simples para ranking

Algoritmo de Ordenação: Insertion Sort em C (ordenarRankingPorMerito())

Integração com IA: obterPalavrasDaIA()

Funções em C: mínimo de cinco funções que manipulam o ranking

Documentação: descrição das principais funções abaixo

Instalação e uso

1. Dependências C

macOS: brew install libmicrohttpd curl

Ubuntu/Debian: sudo apt-get install libmicrohttpd-dev libcurl4-openssl-dev

2. Compilar backend

cd backend
make clean && make

Isso gera o executável dueto_server.

3. Executar backend

./dueto_server

Acesse no navegador: http://localhost:8888/

4. Executar frontend (opcional)

cd frontend
npm install
npm run dev

Abra http://localhost:3000/.

Rotas disponíveis

Rota

Método

Descrição

/

GET

Menu HTML

/login

POST

Registra jogador atual

/palavras

GET

JSON com duas palavras

/ranking

GET

JSON do ranking ordenado em C

/ranking_page

GET

Página HTML exibindo ranking

/ranking/reset

POST

Reseta ranking

Estrutura de Dados e Algoritmo

Lista Ligada de Jogador { nome, tentativas, acertos, prox }

Insertion Sort em C na função ordenarRankingPorMerito()

Documentação de Funções (C)

obterPalavrasDaIA(char *p1, char *p2)

carregarRanking(void)

salvarRanking(void)

adicionarAoRanking(const char *nome, int tentativas, int acertos)

ordenarRankingPorMerito(void)

resetarRanking(void)

liberarRanking(void)

set_current_player(const char *nome)

Licença

MIT © Seu Nome

