#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "tentativa.h"
#include "util.h"

void adicionarTentativa(Tentativa** head, const char* palavra) {
    Tentativa* nova = (Tentativa*)malloc(sizeof(Tentativa));
    if (!nova) {
        printf("Erro ao alocar memória para tentativa.\n");
        exit(1);
    }
    strncpy(nova->palavra, palavra, TAM_PALAVRA);
    nova->palavra[TAM_PALAVRA - 1] = '\0';
    nova->prox = *head;
    *head = nova;
}

void liberarTentativas(Tentativa* head) {
    while (head != NULL) {
        Tentativa* temp = head;
        head = head->prox;
        free(temp);
    }
}

void exibirTentativas(Tentativa* head) {
    Tentativa* atual = head;
    while (atual != NULL) {
        printf("%s\n", atual->palavra);
        atual = atual->prox;
    }
}

static void verificarEImprimirPalavras(const char* input, const char* secreta1, const char* secreta2, bool* acertou1, bool* acertou2) {
    if (strcmp(input, secreta1) == 0) *acertou1 = true;
    if (strcmp(input, secreta2) == 0) *acertou2 = true;

    if (!*acertou1) {
        for (int i = 0; i < 5; i++) {
            if (input[i] == secreta1[i]) {
                printf("\x1b[32m%c\x1b[0m", input[i]);
            } else if (strchr(secreta1, input[i])) {
                printf("\x1b[33m%c\x1b[0m", input[i]);
            } else {
                printf("\x1b[31m%c\x1b[0m", input[i]);
            }
        }
        printf(" ");
    } else {
        printf("\x1b[32m%s\x1b[0m ", secreta1);
    }

    if (!*acertou2) {
        for (int i = 0; i < 5; i++) {
            if (input[i] == secreta2[i]) {
                printf("\x1b[32m%c\x1b[0m", input[i]);
            } else if (strchr(secreta2, input[i])) {
                printf("\x1b[33m%c\x1b[0m", input[i]);
            } else {
                printf("\x1b[31m%c\x1b[0m", input[i]);
            }
        }
    } else {
        printf("\x1b[32m%s\x1b[0m", secreta2);
    }

    printf("\n");
}

void verificarTentativas(Tentativa* head, char* secreta1, char* secreta2, bool* acertou1, bool* acertou2) {
    if (!head) return;
    verificarTentativas(head->prox, secreta1, secreta2, acertou1, acertou2);
    verificarEImprimirPalavras(head->palavra, secreta1, secreta2, acertou1, acertou2);
}
