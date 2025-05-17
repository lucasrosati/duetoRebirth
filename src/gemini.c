#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <stdbool.h>
#include <time.h>

#include "gemini.h"

#define GEMINI_MODEL "gemini-1.5-flash-latest"
#define MAX_RETRIES 10

typedef struct {
    char *buffer;
    size_t size;
} MemoryStruct;

static size_t WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    MemoryStruct *mem = (MemoryStruct *)userp;

    char *ptr = realloc(mem->buffer, mem->size + realsize + 1);
    if (!ptr) return 0;

    mem->buffer = ptr;
    memcpy(&(mem->buffer[mem->size]), contents, realsize);
    mem->size += realsize;
    mem->buffer[mem->size] = 0;

    return realsize;
}

// Limpa espaços, aspas, quebras de linha
static void limparToken(char *token) {
    char limpo[6] = {0};
    int j = 0;
    for (int i = 0; token[i] && j < 5; i++) {
        if (token[i] != '\n' && token[i] != ' ' && token[i] != '"') {
            limpo[j++] = token[i];
        }
    }
    limpo[5] = '\0';
    strcpy(token, limpo);
}

// Gera um trecho de prompt com palavras já usadas do palavras.txt
static void montarHistoricoPrompt(char *saida, size_t maxlen) {
    FILE *f = fopen("palavras.txt", "r");
    if (!f) {
        strcpy(saida, "");
        return;
    }

    char linha[32];
    char palavras[256][8];  // até 256 palavras
    int total = 0;

    while (fgets(linha, sizeof(linha), f)) {
        linha[strcspn(linha, "\n")] = '\0';
        if (strlen(linha) == 5) {
            strcpy(palavras[total++], linha);
            if (total >= 20) break;
        }
    }
    fclose(f);

    if (total == 0) {
        strcpy(saida, "");
        return;
    }

    strcpy(saida, "Evite repetir palavras já usadas como: ");
    for (int i = 0; i < total; i++) {
        strcat(saida, palavras[i]);
        if (i < total - 1)
            strcat(saida, ", ");
    }
    strcat(saida, ".");
}

bool obterPalavrasGemini(char *word1, char *word2) {
    const char *api_key = getenv("GEMINI_API_KEY");
    if (!api_key || strlen(api_key) < 10) {
        fprintf(stderr, "❌ API KEY do Gemini não definida. Use: export GEMINI_API_KEY=xxxxx\n");
        return false;
    }

    for (int tentativa = 1; tentativa <= MAX_RETRIES; tentativa++) {
        // 1. Construção do prompt com histórico
        char historico[512];
        montarHistoricoPrompt(historico, sizeof(historico));

        srand((unsigned)(time(NULL) ^ rand()));
        int aleatorio = rand();

        char prompt[1024];
        snprintf(prompt, sizeof(prompt),
            "Gere duas palavras em português com 5 letras diferentes entre si para um jogo estilo Termo (Wordle). "
            "As palavras devem ser comuns, sem acentos, sem relação entre si e diferentes de partidas anteriores. "
            "%s Retorne apenas as duas palavras, em minúsculas e separadas por vírgula. Exemplo: fruto,leito [%d]",
            historico, aleatorio);

        char payload[2048];
        snprintf(payload, sizeof(payload),
            "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}],"
            "\"generationConfig\":{\"temperature\":0.9,\"maxOutputTokens\":20}}",
            prompt);

        char api_url[512];
        snprintf(api_url, sizeof(api_url),
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
            GEMINI_MODEL, api_key);

        CURL *curl = curl_easy_init();
        if (!curl) return false;

        MemoryStruct chunk = { malloc(1), 0 };
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, api_url);
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, payload);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "dueto-c-gemini/1.0");
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

        CURLcode res = curl_easy_perform(curl);
        bool success = false;

        if (res == CURLE_OK) {
            char *text_start = strstr(chunk.buffer, "\"text\": \"");
            if (text_start) {
                text_start += strlen("\"text\": \"");
                char *text_end = strchr(text_start, '"');
                if (text_end) {
                    char raw[64];
                    size_t len = text_end - text_start;
                    strncpy(raw, text_start, len);
                    raw[len] = '\0';

                    char *token1 = strtok(raw, ",");
                    char *token2 = strtok(NULL, ",");

                    if (token1 && token2) {
                        limparToken(token1);
                        limparToken(token2);
                        if (strlen(token1) == 5 && strlen(token2) == 5 && strcmp(token1, token2) != 0) {
                            FILE *hist = fopen("palavras.txt", "a");
                            if (hist) {
                                fprintf(hist, "%s\n%s\n", token1, token2);
                                fclose(hist);
                            }

                            strcpy(word1, token1);
                            strcpy(word2, token2);
                            success = true;
                        }
                    }
                }
            }
        } else {
            fprintf(stderr, "Erro na requisição Gemini: %s\n", curl_easy_strerror(res));
        }

        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
        free(chunk.buffer);

        if (success) return true;
    }

    fprintf(stderr, "⚠️  Não foi possível gerar palavras inéditas após %d tentativas.\n", MAX_RETRIES);
    return false;
}

bool obterPalavrasDaIA(char *palavra1, char *palavra2) {
    return obterPalavrasGemini(palavra1, palavra2);
}
