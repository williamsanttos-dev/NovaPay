# NovaPay

MVP para uma apresentação de um projeto de faculdade sobre uma fintech que utiliza de blockchain para registrar as transações.

O objetivo é **demonstrar o conceito de registro público e imutável de transações**.

## Componentes do Sistema

Backend(Node)

- Função: registro e validação da ledger
- Descrição: Recebe transações, cria blocos e garante que cada novo bloco herda o `hash` do anterior

Legder simulada (arquivo JSON)

- Função: Armazena o bloco
- Descrição: Contém o histórico público (imutável) das transações

Frontend (Web)

- Função: Interface mínima para o usuário
- Descrição: Permite criar novas transações e visualizar o histórico completo da ledger

## 🧾 Fluxo do MVP (passo a passo)

**1. Usuário cria uma transação**

- Exemplo: “Alice envia 100 tokens para Bob”.
- O backend gera um novo bloco com essa transação.
- Calcula o `hash` e liga ao bloco anterior (`prev_hash`).

**2. O backend armazena esse bloco na ledger (chain.json)**

- Cada bloco contém: `index`, `timestamp`, `transactions`, `prev_hash`, `hash`.

**3. O usuário acessa uma página pública**

- Vê uma lista de todas as transações (blocos ordenados).
- Pode clicar para ver detalhes (quem enviou, valor, hash, data).

**4. O usuário pode clicar em “Verificar integridade”**

- O sistema percorre toda a chain e recalcula os hashes.
- Se alguém tentar adulterar, a verificação falha.

## 🔍 O que o MVP demonstra tecnicamente

✅ **Conceito de imutabilidade e rastreabilidade** — os hashes e o encadeamento dos blocos mostram como a blockchain garante integridade.
✅ **Prova de transparência** — qualquer pessoa pode ler a ledger (registro público).
✅ **Usabilidade e simplicidade** — a UI mostra como seria fácil usar o sistema.

## Como rodar o projeto

### 🧩 Requisitos

- Node >= 22.16.0
- npm >= 10.9.2

### 📦 Instalação das dependências

No terminal, dentro do diretório do projeto, execute:

`npm install`

### ▶️ Iniciar o servidor

Para rodar em modo normal:

`npm run start`

O servidor será iniciado na porta configurada (por padrão `http://localhost:3002`)

### 🌐 Testar as rotas via REST Client (opcional)

Se preferir enviar requisições diretamente do VS Code:

- Instale a extensão REST Client (VS Code Marketplace → pesquise por “REST Client” → Instalar).
- Abra o arquivo `server.http` no projeto.
- Clique em “Send Request” acima de cada requisição.

> Para mais detalhes técnicos sobre a implementação da ledger, veja [NOTAS_TECNICAS.md](./NOTAS_TECNICAS.md).
