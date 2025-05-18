DUETO - Jogo de Dueto

Visão Geral:
Jogo de palavras inspirado no Wordle em duplas. Frontend em React/Tailwind e backend em C com servidor HTTP.

Requisitos atendidos:

Backend em C usando libmicrohttpd.

Menu interativo em HTML servido pelo backend em C.

Lista ligada simples para ranking.

Insertion sort em C (função ordenarRankingPorMerito()).

Integração com IA (obterPalavrasDaIA()).

Mínimo de cinco funções em C manipulando ranking.

Documentação das funções abaixo.

Instalação e uso:

Instalar libmicrohttpd e libcurl (libmicrohttpd-dev, libcurl-dev).

No diretório backend: rodar make e depois ./dueto_server.

Acessar no navegador: http://localhost:8888/

Na interface, usar botões: Jogar, Visualizar Ranking, Resetar Ranking.

Frontend em React: no diretório frontend, rodar npm install e npm run dev.

Rotas do servidor C:
GET  /           -> menu HTML
POST /login      -> registra jogador
GET  /palavras   -> JSON com duas palavras
GET  /ranking    -> JSON do ranking ordenado em C
GET  /ranking_page -> página HTML do ranking
POST /ranking/reset -> reseta ranking

Funções principais (C):

obterPalavrasDaIA(p1, p2): busca palavras na IA.

carregarRanking(): lê arquivo e popula lista.

salvarRanking(): escreve arquivo com ranking.

adicionarAoRanking(nome, tentativas, acertos): insere nó e chama ordenação.

ordenarRankingPorMerito(): insertion sort na lista ligada.

resetarRanking(): limpa lista e arquivo.

liberarRanking(): libera memória.

set_current_player(nome): armazena jogador atual.

Estrutura de Dados:
Lista ligada de Jogador { nome, tentativas, acertos, prox }.

Licença:
MIT © Seu Nome
