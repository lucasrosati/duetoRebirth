#ifndef GEMINI_H
#define GEMINI_H

#include <stdbool.h>

// Usa a API Gemini para obter duas palavras de 5 letras.
// Retorna true em caso de sucesso.
bool obterPalavrasGemini(char *word1, char *word2);

// Wrapper usado no jogo para facilitar leitura
bool obterPalavrasDaIA(char* palavra1, char* palavra2);

#endif
