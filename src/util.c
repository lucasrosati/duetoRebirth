#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include "util.h"

void limparBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF) {}
}

void pausarParaContinuar() {
    printf("\nPressione Enter para continuar...");
    fflush(stdout);
    int c;
    while ((c = getchar()) != '\n' && c != EOF);  // Limpa o buffer
    getchar(); // Aguarda ENTER real
}


void limparTela() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void converterParaMinusculas(char* str) {
    for (int i = 0; str[i]; i++) {
        str[i] = tolower(str[i]);
    }
}
