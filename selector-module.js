const { selectRelevantImage } = require("./utils/openai");
const fs = require("fs");

async function selectBestImageFromFile(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(content);

    const images = data[0]?.images;
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("No images found in the JSON file.");
    }

    console.log("Found images:", images);

    const picked = await selectRelevantImage(images);
    console.log("Picked image:", picked);

    return picked;
  } catch (err) {
    console.error("Failed to read, parse, or select image:", err.message);
    throw err;
  }
}

module.exports = { selectBestImageFromFile };