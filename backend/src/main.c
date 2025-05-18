#include <stdlib.h>
#include <time.h>
#include "menu.h"
#include "ranking.h"

int main() {
    srand(time(NULL));
    carregarRanking();
    menu();
    salvarRanking();
    liberarRanking();
    return 0;
}
