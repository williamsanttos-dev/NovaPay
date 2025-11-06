import express from "express";
import * as legder from "./ledger.js";

const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("json spaces", 2);

app.post("/tx", (req, res) => {
  const { from, to, amount, meta, signature } = req.body;
  if (!from || !to || amount == null)
    return res.status(400).json({
      error: "from, to, and amount are required",
    });

  const result = legder.addTransactionAndBlock({
    from,
    to,
    amount,
    meta,
    signature,
  });

  return res.status(200).json(result);
});

app.get("/chain", (req, res) => {
  res.status(200).json(legder.getChain());
});

app.get("/verify", (req, res) => {
  res.status(200).json(legder.verifyChain());
});

app.get("/health", (req, res) => {
  res.status(200).json("OK");
});

app.listen(PORT, () => console.log("API running on port", PORT));
