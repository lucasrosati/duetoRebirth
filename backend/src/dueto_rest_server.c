#include <microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "gemini.h"
#include "ranking.h"
#include "util.h"  // para limparTela, pausarParaContinuar

#define PORT 8888

static enum MHD_Result responder_json(struct MHD_Connection *connection,
                                      const char *json,
                                      int status_code) {
    struct MHD_Response *response = MHD_create_response_from_buffer(
        strlen(json), (void *)json, MHD_RESPMEM_MUST_COPY
    );
    MHD_add_response_header(response, "Content-Type", "application/json");
    MHD_add_response_header(response, "Access-Control-Allow-Origin", "*");
    int ret = MHD_queue_response(connection, status_code, response);
    MHD_destroy_response(response);
    return ret;
}

static enum MHD_Result callback(void *cls,
                                struct MHD_Connection *connection,
                                const char *url,
                                const char *method,
                                const char *version,
                                const char *upload_data,
                                size_t *upload_data_size,
                                void **con_cls) {
    // GET /palavras
    if (strcmp(url, "/palavras") == 0 && strcmp(method, "GET") == 0) {
        char p1[16], p2[16];
        if (!obterPalavrasDaIA(p1, p2)) {
            return responder_json(connection, "{\"erro\":\"Falha ao obter palavras\"}", 500);
        }
        char out[128];
        snprintf(out, sizeof(out), "{\"palavra1\":\"%s\",\"palavra2\":\"%s\"}", p1, p2);
        return responder_json(connection, out, 200);
    }
    // GET /ranking
    if (strcmp(url, "/ranking") == 0 && strcmp(method, "GET") == 0) {
        ordenarRankingPorMerito();
        static char json[2048];
        strcpy(json, "[");
        Jogador *it = ranking;
        while (it) {
            char entry[256];
            snprintf(entry, sizeof(entry),
                     "{\"nome\":\"%s\",\"tentativas\":%d,\"acertos\":%d}",
                     it->nome, it->tentativas, it->acertos);
            strcat(json, entry);
            if (it->prox) strcat(json, ",");
            it = it->prox;
        }
        strcat(json, "]");
        return responder_json(connection, json, 200);
    }
    // POST /ranking/reset
    if (strcmp(url, "/ranking/reset") == 0 && strcmp(method, "POST") == 0) {
        resetarRanking();
        return responder_json(connection, "{\"status\":\"ok\"}", 200);
    }
    // rota nao encontrada
    return responder_json(connection, "{\"erro\":\"Rota nao encontrada\"}", 404);
}

int main(void) {
    carregarRanking();
    struct MHD_Daemon *daemon = MHD_start_daemon(
        MHD_USE_INTERNAL_POLLING_THREAD,
        PORT,
        NULL, NULL,
        &callback, NULL,
        MHD_OPTION_END
    );
    if (!daemon) {
        fprintf(stderr, "Erro ao iniciar servidor HTTP\n");
        return 1;
    }
    printf("Servidor Dueto rodando em http://localhost:%d\n", PORT);
    getchar();  // espera ENTER
    salvarRanking();
    liberarRanking();
    MHD_stop_daemon(daemon);
    return 0;
}
