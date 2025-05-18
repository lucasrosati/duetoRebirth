#ifndef TENTATIVA_H
#define TENTATIVA_H

#include <stdbool.h>

#define TAM_PALAVRA 10

typedef struct Tentativa {
    char palavra[TAM_PALAVRA];
    struct Tentativa* prox;
} Tentativa;

// Adiciona uma nova palavra à lista de tentativas
void adicionarTentativa(Tentativa** head, const char* palavra);

// Libera toda a lista de tentativas da memória
void liberarTentativas(Tentativa* head);

// (Opcional) Exibe todas as tentativas feitas
void exibirTentativas(Tentativa* head);

// Verifica todas as tentativas e imprime feedback colorido
void verificarTentativas(Tentativa* head, char* secreta1, char* secreta2, bool* acertou1, bool* acertou2);

#endif
