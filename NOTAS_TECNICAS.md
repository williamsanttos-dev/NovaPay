> Código de referência (resumido): temos funções: `sha256`, `loadChain`, `saveChain`, `createGenesis`, `createTransaction`, `createBlock`, `addTransactionAndBlock`, `getChain`, `verifyChain`.

## `sha256(input)`

**O que faz**: calcula o hash SHA-256 do `input` (string/JSON) e retorna hex.  
**Por quê**: o hash é o mecanismo central de “impressão digital” dos dados — pequenas mudanças no conteúdo geram um hash completamente diferente, o que torna fácil detectar alterações.

---

## `loadChain()`

**O que faz**: carrega a cadeia persistida do arquivo `./data/chain.json`. Se não existir, cria o _genesis block_ chamando `createGenesis()` e grava.  
**Por quê**: a aplicação precisa de um estado persistente (a ledger) que sobreviva reinícios do servidor. Para o projeto foi usado um arquivo JSON.

---

## `saveChain(chain)`

**O que faz**: serializa e grava o `chain` em disco.  
**Por quê**: persistir alterações. Mantém consistência entre memória e disco.

---

## `createGenesis()`

**O que faz**: monta o primeiro bloco da cadeia (index 0), com `prev_hash` preenchido com zeros e calcula seu `hash`.  
**Por quê**: todo blockchain precisa de um ponto inicial comum — o _genesis block_ é esse ponto de consenso/âncora. É preciso defini-lo explicitamente para que o próximo bloco tenha um `prev_hash` válido. A existência do genesis é fundamental para que a cadeia seja verificável desde a raiz.

---

## `createTransaction({ from, to, amount, meta, signature })`

**O que faz**: cria um objeto de transação com `id` (UUID), campos `from`, `to`, `amount`, `meta`, `timestamp`, `signature`.  
**Por quê**: encapsula a lógica de construir uma transação consistente com ID e timestamp. O ID ajuda a referenciar a tx e evitar duplicatas; o timestamp fornece ordem aproximada entre txs. `signature` é opcional no MVP, mas permite depois provar autoria.

---

## `createBlock(transactions, prev_block)`

**O que faz**: monta um novo bloco com `index = prev.index + 1`, `timestamp`, `transactions`, `prev_hash = prev_block.hash`, `nonce` (aqui fixo 0) e calcula o `hash` do bloco usando `sha256` de `{ index, timestamp, transactions, prev_hash, nonce }`.  
**Por quê**: o bloco agrega transações e vincula-se ao bloco anterior via `prev_hash`. O `hash` do bloco resume todo o conteúdo do bloco e, combinado com `prev_hash`, cria a cadeia de prova (cadeia encadeada).

---

## `addTransactionAndBlock(txPayload)`

**O que faz**: fluxo conveniente: carrega a chain, cria a tx (`createTransaction`), cria o bloco (`createBlock`) contendo essa tx, empurra o bloco para a chain e salva no disco. Retorna a tx e bloco criado.  
**Por quê**: encapsula o caminho típico de uso: “recebo payload → crio tx → crio bloco → persisto”. Ajuda a manter a lógica coesa.

---

## `getChain()`

**O que faz**: retorna a chain carregada do disco (ou em memória).  
**Por quê**: endpoint público para mostrar registro; componente essencial para transparência/demonstração. Em produção, esse endpoint pode ser somente leitura pública (sem dados sensíveis).

---

## `verifyChain()`

**O que faz**: percorre a chain e para cada bloco `i>0` verifica duas coisas:

1. `block.prev_hash === chain[i-1].hash` (integridade do encadeamento)
2. `recomputed_hash === block.hash` (integridade do bloco)  
   Se qualquer verificação falhar, retorna `{ valid: false, reason: ... }`, caso contrário `{ valid: true }`.  
   **Por quê**: é a função que prova imutabilidade: se alguém modificar UM campo de um bloco antigo (ou o `prev_hash`), a verificação falha. É a função que torna a ledger _tamper-evident_.
