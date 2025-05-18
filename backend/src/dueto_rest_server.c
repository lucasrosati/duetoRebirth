#include <microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "gemini.h"
#include "ranking.h"

#define PORT 8888

static enum MHD_Result responder_json(struct MHD_Connection *connection, const char *json, int status_code) {
    struct MHD_Response *response = MHD_create_response_from_buffer(strlen(json), (void *)json, MHD_RESPMEM_MUST_COPY);
    MHD_add_response_header(response, "Content-Type", "application/json");
    MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
    int ret = MHD_queue_response(connection, status_code, response);
    MHD_destroy_response(response);
    return ret;
}

static enum MHD_Result callback(void *cls, struct MHD_Connection *connection,
                                const char *url, const char *method,
                                const char *version, const char *upload_data,
                                size_t *upload_data_size, void **con_cls) {

    if (strcmp(url, "/palavras") == 0 && strcmp(method, "GET") == 0) {
        char palavra1[16], palavra2[16];
        if (!obterPalavrasDaIA(palavra1, palavra2)) {
            return responder_json(connection, "{\"erro\":\"Falha ao obter palavras\"}", 500);
        }
        char json[128];
        snprintf(json, sizeof(json), "{\"palavra1\":\"%s\",\"palavra2\":\"%s\"}", palavra1, palavra2);
        return responder_json(connection, json, 200);
    }

    if (strcmp(url, "/ranking") == 0 && strcmp(method, "GET") == 0) {
        static char json[2048];
        strcpy(json, "[");
        Jogador *atual = ranking;
        while (atual) {
            char entry[256];
            snprintf(entry, sizeof(entry), "{\"nome\":\"%s\",\"tentativas\":%d,\"acertos\":%d}",
                     atual->nome, atual->tentativas, atual->acertos);
            strcat(json, entry);
            if (atual->prox) strcat(json, ",");
            atual = atual->prox;
        }
        strcat(json, "]");
        return responder_json(connection, json, 200);
    }

    if (strcmp(url, "/ranking/reset") == 0 && strcmp(method, "POST") == 0) {
        resetarRanking();
        return responder_json(connection, "{\"status\":\"ok\"}", 200);
    }

    return responder_json(connection, "{\"erro\":\"Rota nao encontrada\"}", 404);
}

int main() {
    carregarRanking();

    struct MHD_Daemon *daemon;
    daemon = MHD_start_daemon(MHD_USE_INTERNAL_POLLING_THREAD, PORT, NULL, NULL,
                              &callback, NULL, MHD_OPTION_END);
    if (!daemon) {
        fprintf(stderr, "Erro ao iniciar servidor\n");
        return 1;
    }

    printf("Servidor Dueto rodando em http://localhost:%d\n", PORT);
    getchar();

    salvarRanking();
    liberarRanking();
    MHD_stop_daemon(daemon);
    return 0;
}
