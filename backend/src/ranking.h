#ifndef RANKING_H
#define RANKING_H

#include "tentativa.h"

#define MAX_NOME 50

typedef struct Jogador {
    char nome[MAX_NOME];
    int tentativas;
    int acertos;
    Tentativa* tentativasList;     
    struct Jogador* prox;
} Jogador;

extern Jogador* ranking;

void adicionarAoRanking(const char* nome, int tentativas, int acertos);
void exibirRanking();
void salvarRanking();
void carregarRanking();
void liberarRanking();
void resetarRanking();
void ordenarRankingPorMerito();

#endif
