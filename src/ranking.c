#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "ranking.h"

Jogador* ranking = NULL;

void adicionarAoRanking(const char* nome, int tentativas, int acertos) {
    Jogador* novo = malloc(sizeof(Jogador));
    if (!novo) {
        printf("Erro ao alocar memória para novo jogador.\n");
        exit(1);
    }

    strncpy(novo->nome, nome, MAX_NOME);
    novo->tentativas = tentativas;
    novo->acertos = acertos;
    novo->prox = NULL;

    novo->prox = ranking;
    ranking = novo;

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

void exibirRanking() {
    printf("\nRANKING:\n");
    Jogador* atual = ranking;
    int pos = 1;
    while (atual) {
        printf("%d. %s - Acertos: %d | Tentativas: %d\n", pos++, atual->nome, atual->acertos, atual->tentativas);
        atual = atual->prox;
    }
}

void salvarRanking() {
    FILE* file = fopen("ranking.txt", "w");
    if (!file) {
        perror("Erro ao salvar ranking");
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
    printf("Ranking resetado com sucesso.\n");
}
