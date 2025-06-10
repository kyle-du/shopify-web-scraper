#!/usr/bin/env node

const { selectRelevantImage } = require("./utils/openai");
const fs = require("fs");

const filePath = "./data/Fruit Basket.json";

(async () => {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(content);

    const images = data[0]?.images;
    console.log(images);

    const picked = await selectRelevantImage(images);

    console.log("picked image: ", picked);
  } catch (err) {
    console.error("Failed to read or parse file:", err.message);
  }
})();
