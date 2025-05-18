#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdbool.h>
#include <ctype.h>

#include "jogo.h"
#include "ranking.h"
#include "tentativa.h"
#include "util.h"
#include "gemini.h"

#define TAM_PALAVRA 10
#define MAX_TENTATIVAS 6

void jogar() {
    limparTela();

    char nomeJogador[50];
    printf("Digite seu nome: ");
    fgets(nomeJogador, sizeof(nomeJogador), stdin);
    nomeJogador[strcspn(nomeJogador, "\n")] = '\0';

    char palavraSecreta1[TAM_PALAVRA], palavraSecreta2[TAM_PALAVRA];
    if (!obterPalavrasDaIA(palavraSecreta1, palavraSecreta2)) {
        printf("Erro ao obter palavras da IA. Encerrando o jogo.\n");
        pausarParaContinuar(); // <-- adicione isso para enxergar o erro
        return;
    }

    Jogador jogador;
    strcpy(jogador.nome, nomeJogador);
    jogador.tentativas = 0;
    jogador.acertos = 0;
    jogador.tentativasList = NULL;

    char tentativa[TAM_PALAVRA];
    bool acertou1 = false, acertou2 = false;

    while (jogador.tentativas < MAX_TENTATIVAS && (!acertou1 || !acertou2)) {
        printf("\nDigite uma palavra de 5 letras: ");
        fgets(tentativa, sizeof(tentativa), stdin);
        tentativa[strcspn(tentativa, "\n")] = '\0';

        if (strlen(tentativa) != 5) {
            printf("Erro: Você deve inserir exatamente 5 letras. Tente novamente.\n");
            continue;
        }

        converterParaMinusculas(tentativa);
        adicionarTentativa(&jogador.tentativasList, tentativa);

        limparTela();
        verificarTentativas(jogador.tentativasList, palavraSecreta1, palavraSecreta2, &acertou1, &acertou2);
        jogador.tentativas++;
    }

    printf("\nAs palavras eram \"%s\" e \"%s\".\n", palavraSecreta1, palavraSecreta2);
    jogador.acertos = (acertou1 ? 1 : 0) + (acertou2 ? 1 : 0);
    printf("\n%s: Você acertou %d palavras com %d tentativas.\n", jogador.nome, jogador.acertos, jogador.tentativas);
    adicionarAoRanking(jogador.nome, jogador.tentativas, jogador.acertos);

    liberarTentativas(jogador.tentativasList);

    pausarParaContinuar();
}
