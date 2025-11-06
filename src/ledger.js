import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

const _dirname = path.dirname(fileURLToPath(import.meta.url));
const PATH = path.join(_dirname, "data", "chain.json");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function addTransactionAndBlock(txPayload) {
  const chain = loadChain();
  const tx = createTransaction(txPayload);
  // uma transação por bloco.
  // estamos pegando o último bloco e passando a última transação para criar um bloco válido.
  const newBlock = createBlock([tx], chain[chain.length - 1]);
  chain.push(newBlock);
  saveChain(chain);
  return { tx, block: newBlock };
}

function loadChain() {
  if (!fs.existsSync(PATH)) {
    const genesis = createGenesis();
    fs.mkdirSync(`${_dirname}/data`, { recursive: true });
    fs.writeFileSync(PATH, JSON.stringify([genesis], null, 2));
    return [genesis];
  }
  return JSON.parse(fs.readFileSync(PATH, "utf-8"));
}

function createGenesis() {
  const block = {
    index: 0,
    timestamp: new Date().toISOString(),
    transactions: [],
    prev_hash: "0".repeat(64),
    nonce: 0,
  };
  block.hash = sha256(
    JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions,
      prev_hash: block.prev_hash,
      nonce: block.nonce,
    })
  );
  return block;
}

function createTransaction({ from, to, amount, meta = "", signature = null }) {
  return {
    id: uuidv4(),
    from,
    to,
    amount,
    meta,
    timestamp: new Date().toISOString(),
    signature,
  };
}

function createBlock(transactions, prev_block) {
  const index = prev_block.index + 1;
  const block = {
    index,
    timestamp: new Date().toISOString(),
    transactions,
    prev_hash: prev_block.hash,
    nonce: 0,
  };
  block.hash = sha256(
    JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions,
      prev_hash: block.prev_hash,
      nonce: block.nonce,
    })
  );
  return block;
}

function saveChain(chain) {
  fs.writeFileSync(PATH, JSON.stringify(chain, null, 2));
}

export function getChain() {
  return loadChain();
}

export function verifyChain() {
  const chain = loadChain();
  for (let i = 1; i < chain.length; i++) {
    const cur = chain[i];
    const prev = chain[i - 1];
    // check prev_hash
    if (cur.prev_hash !== prev.hash)
      return { valid: false, reason: `prev_hash mismatch at index ${i}` };
    // recompute hash
    const recomputed = sha256(
      JSON.stringify({
        index: cur.index,
        timestamp: cur.timestamp,
        transactions: cur.transactions,
        prev_hash: cur.prev_hash,
        nonce: cur.nonce,
      })
    );
    if (recomputed !== cur.hash)
      return { valid: false, reason: `hash mismatch at index ${i}` };
    return { valid: true };
  }
}
