#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "ranking.h"
#include "util.h"

Jogador* ranking = NULL;

void adicionarAoRanking(const char* nome, int tentativas, int acertos) {
    Jogador* novo = (Jogador*)malloc(sizeof(Jogador));
    if (!novo) {
        printf("Erro ao alocar memória para jogador.\n");
        exit(1);
    }

    strncpy(novo->nome, nome, MAX_NOME);
    novo->nome[MAX_NOME - 1] = '\0';
    novo->tentativas = tentativas;
    novo->acertos = acertos;
    novo->prox = NULL;

    if (!ranking) {
        ranking = novo;
    } else {
        Jogador* atual = ranking;
        while (atual->prox) atual = atual->prox;
        atual->prox = novo;
    }

    ordenarRankingPorMerito();
}

void ordenarRankingPorMerito() {
    if (!ranking || !ranking->prox) return;

    Jogador* sorted = NULL;

    while (ranking) {
        Jogador* atual = ranking;
        ranking = ranking->prox;

        if (!sorted || atual->acertos > sorted->acertos ||
            (atual->acertos == sorted->acertos && atual->tentativas < sorted->tentativas)) {
            atual->prox = sorted;
            sorted = atual;
        } else {
            Jogador* temp = sorted;
            while (temp->prox &&
                   (temp->prox->acertos > atual->acertos ||
                   (temp->prox->acertos == atual->acertos && temp->prox->tentativas <= atual->tentativas))) {
                temp = temp->prox;
            }
            atual->prox = temp->prox;
            temp->prox = atual;
        }
    }

    ranking = sorted;
}

void salvarRanking() {
    FILE* file = fopen("ranking.txt", "w");
    if (!file) {
        printf("Erro ao salvar o ranking.\n");
        return;
    }

    Jogador* atual = ranking;
    while (atual) {
        fprintf(file, "%s %d %d\n", atual->nome, atual->tentativas, atual->acertos);
        atual = atual->prox;
    }

    fclose(file);
}

void carregarRanking() {
    FILE* file = fopen("ranking.txt", "r");
    if (!file) return;

    char nome[MAX_NOME];
    int tentativas, acertos;

    while (fscanf(file, "%s %d %d", nome, &tentativas, &acertos) == 3) {
        adicionarAoRanking(nome, tentativas, acertos);
    }

    fclose(file);
}

void exibirRanking() {
    limparTela();

    printf("🏆 RANKING DOS JOGADORES 🏆\n\n");

    Jogador* atual = ranking;
    int pos = 1;

    while (atual) {
        printf("%2d. %-20s | Acertos: %d | Tentativas: %d\n",
               pos++, atual->nome, atual->acertos, atual->tentativas);
        atual = atual->prox;
    }

    if (pos == 1) {
        printf("Nenhum jogador registrado ainda.\n");
    }

    printf("\nPressione Enter para voltar ao menu...");
    pausarParaContinuar();
}

void liberarRanking() {
    Jogador* atual = ranking;
    while (atual) {
        Jogador* temp = atual;
        atual = atual->prox;
        free(temp);
    }
    ranking = NULL;
}

void resetarRanking() {
    liberarRanking();
    FILE* file = fopen("ranking.txt", "w");
    if (file) fclose(file);
}
