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
          `Extract what you believe to be the store and product name from the user prompt. 
          If there is only a store name, return just the store name and leave product name empty.
          If there is only a product name, return just the product name and leave store name empty.
          Return them in JSON like { store: '', product: '' }`,
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