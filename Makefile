# Makefile – duetoRebirth

CC = gcc
CFLAGS = -Wall -Iinclude
SRC_DIR = src
SRC = $(SRC_DIR)/main.c \
      $(SRC_DIR)/gemini.c \
      $(SRC_DIR)/jogo.c \
      $(SRC_DIR)/menu.c \
      $(SRC_DIR)/ranking.c \
      $(SRC_DIR)/tentativa.c \
      $(SRC_DIR)/util.c

BIN = dueto

all: $(BIN)

$(BIN): $(SRC)
	$(CC) $(CFLAGS) $^ -o $@ -lcurl

run: $(BIN)
	./$(BIN)

clean:
	rm -f $(BIN)
