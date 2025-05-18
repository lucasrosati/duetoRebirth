#include <stdio.h>
#include "menu.h"
#include "jogo.h"
#include "ranking.h"
#include "util.h"

void menu() {
    int opcao;
    do {
        limparTela();
        printf("\nMenu:\n");
        printf("1. Jogar\n");
        printf("2. Ver Ranking\n");
        printf("3. Resetar Ranking\n");
        printf("4. Sair\n");
        printf("Escolha uma opção: ");
        scanf("%d", &opcao);
        limparBuffer();

        switch (opcao) {
            case 1:
                jogar();
                break;
            case 2:
                exibirRanking();
                break;
            case 3:
                resetarRanking();
                break;
            case 4:
                printf("Obrigado por jogar!\n");
                break;
            default:
                printf("Opção inválida, tente novamente.\n");
                pausarParaContinuar();
        }
    } while (opcao != 4);
}
