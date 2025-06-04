const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractStoreAndProduct(prompt) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Extract store and product name from the user prompt. Return them in JSON like { store: '', product: '' }",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = chatCompletion.choices[0].message.content.trim();
  return JSON.parse(content);
}

module.exports = { extractStoreAndProduct };