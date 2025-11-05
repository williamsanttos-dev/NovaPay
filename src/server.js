import express from "express";

const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("json spaces", 2);

app.get("/health", (req, res) => {
  res.status(200).json("OK");
});

app.listen(PORT, () => console.log("API running on port", PORT));
