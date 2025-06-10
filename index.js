const express = require("express");
const cors = require("cors");
const { extractStoreAndProduct } = require("./utils/openai");
const { scrapeProduct } = require("./scraper-module.js");
const { selectBestImageFromFile } = require("./selector-module.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message);

  try {
    const reply = await extractStoreAndProduct(message);
    res.json({ reply });
  } catch (err) {
    console.error("Error during extraction:", err);
    res.status(500).json({ reply: "Failed to process message." });
  }
});

app.post("/scrape", async (req, res) => {
  const { store, product } = req.body;
  console.log("Received store:", store);
  console.log("Received product:", product);

  try {
    const jsonPath = await scrapeProduct({ store, product });
    const imageUrl = await selectBestImageFromFile(jsonPath);
    res.json({ image: imageUrl });
  } catch (err) {
    console.error("Error during extraction:", err);
    res.status(500).json({ reply: "Failed to process message." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});