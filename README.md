# Dueto Rebirth

**Visão Geral**  
Dueto Rebirth é um jogo de adivinhação de duas palavras simultâneas. Backend em C, frontend em React + Vite, integrado à API Gemini para gerar dicas inteligentes.

---

## 🧱 Requisitos

- GCC ou Clang (`gcc`, `make`)  
- `libcurl-dev`  
- `libmicrohttpd-dev`  
- Node.js ≥ 14 e npm ou yarn  
- API Key da Gemini

---

## ⚙️ Instalação de Dependências

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install build-essential libcurl4-openssl-dev libmicrohttpd-dev
```
## MacOS (Homebrew):
```bash
brew install curl microhttpd
```
## 🔧 Backend (C)

Acesse a pasta do backend:
```bash
cd backend
```
Compile o projeto:
```bash
make
```
Isso gera dois executáveis:
dueto: versão CLI do jogo
dueto_server: versão REST

Para rodar o servidor REST:
```bash
./dueto_server
```
## 💻 Frontend (React + Vite)

Acesse a pasta do frontend:
```bash
cd ../frontend
```
Instale as dependências:
```bash
npm install
```
Crie um arquivo .env com sua API Key:
VITE_GEMINI_API_KEY=SUA_API_KEY_AQUI

Rode o frontend:
```bash
npm run dev
```
Acesse no navegador:
```bash
http://localhost:3000
```
## 🕹️ Como Jogar

Você precisa acertar duas palavras simultaneamente.
São 6 tentativas no total.
A cada tentativa, você recebe feedback visual:
✅ Letra correta na posição certa
🟡 Letra presente mas na posição errada
⬜ Letra ausente

## 🌐 Endpoints REST
```bash
GET /status
```
Verifica se o servidor está online.

Resposta:
```bash
{ "status": "ok" }
```
```bash
POST /guess
```
Envia um palpite de palavra.

Corpo da requisição:
```bash
{ "guess": "palavra" }
Resposta esperada:

{
  "feedback": [0, 1, 2, 0, 0],
  "correct": false
}
```
## 🤝 Contribuição

Fork o repositório e clone localmente.
Crie uma branch para sua feature:
git checkout -b feature/nome-da-feature
Faça os commits com mensagens claras.
Abra um Pull Request para main.

## 📜 Licença

Este projeto está sob a licença MIT.
