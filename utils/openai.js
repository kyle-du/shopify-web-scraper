const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractStoreAndProduct(prompt) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          `Extract what you believe to be the store (brand or company) and product name from the user's prompt.

          Use your internal knowledge of well-known beauty, skincare, and cosmetics brands to determine if any part of the prompt matches a known store or brand name.
          If this fails to detect a store name, then use context clues.

          - If a known brand name appears, treat that as the store name.
          - The remaining part of the prompt should be treated as the product name.
          - If only a brand name is detected, leave the product name empty.
          - If only a product name is detected with no recognizable brand, leave the store name empty.

          Return the result in the format:
          { "store": "...", "product": "..." }
          `,
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

async function selectRelevantImage(images) {
  const visionInputs = images.map((url, index) => ({
    type: "image_url",
    image_url: { url },
  }));

  // hardcoded to lipstick rn
  const prompt = `These are some images of a lipstick product. Which image 
    provides the clearest, most complete visual of the physical product itself — 
    ideally showing the shape, color, and structure — and would be most useful for 
    generating a 3D model of the product? Ignore images that focus primarily 
    on packaging, branding, text, or accessories. Return ONLY the number of 
    the image that best meets this criteria.`;

  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        ...visionInputs,
      ],
    },
  ];

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0,
    max_tokens: 10,
  });

  const reply = res.choices[0].message.content.trim();
  const match = reply.match(/(\d)/);

  if (match) {
    const index = parseInt(match[1], 10) - 1;
    return images[index];
  } else {
    throw new Error(`Could not parse GPT-4o response: "${reply}"`);
  }
}

module.exports = { extractStoreAndProduct, selectRelevantImage };