# Makefile unificado: jogo + API REST

CC = gcc
CFLAGS = -Wall -g -Iinclude -I/opt/homebrew/include
LDFLAGS = -L/opt/homebrew/lib -lcurl -lmicrohttpd

SRC_DIR = src

# Binários
BIN_GAME = dueto
BIN_API = dueto_server

# Fontes do jogo
GAME_SRC = \
  $(SRC_DIR)/main.c \
  $(SRC_DIR)/gemini.c \
  $(SRC_DIR)/jogo.c \
  $(SRC_DIR)/menu.c \
  $(SRC_DIR)/ranking.c \
  $(SRC_DIR)/tentativa.c \
  $(SRC_DIR)/util.c

# Fontes da API REST
API_SRC = \
  $(SRC_DIR)/dueto_rest_server.c \
  $(SRC_DIR)/gemini.c \
  $(SRC_DIR)/ranking.c \
  $(SRC_DIR)/util.c \
  $(SRC_DIR)/tentativa.c

.PHONY: all game api run clean

all: game api

# Compilar jogo
game: $(BIN_GAME)

$(BIN_GAME): $(GAME_SRC)
	$(CC) $(CFLAGS) $^ -o $@ -lcurl

# Compilar servidor REST
api: $(BIN_API)

$(BIN_API): $(API_SRC)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

# Rodar servidor REST
run: $(BIN_API)
	./$(BIN_API)

# Limpar binários
clean:
	rm -f $(BIN_GAME) $(BIN_API)
