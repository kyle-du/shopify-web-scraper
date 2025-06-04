const axios = require("axios");
const { URL } = require("url");

/**
 * Given a full Shopify product URL, sanitize and fetch .js product data.
 * @param {string} productUrl - The URL of the Shopify product page.
 * @returns {Promise<Object>} Parsed product JSON from the .js endpoint.
 */
async function fetchShopifyProductData(productUrl) {
  try {
    const parsedUrl = new URL(productUrl);
    const basePath = `${parsedUrl.origin}${parsedUrl.pathname}`;

    const jsonUrl = basePath.endsWith(".js") ? basePath : `${basePath}.js`;

    const response = await axios.get(jsonUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ShopifyScraper/1.0)",
        Accept: "application/json",
      },
    });

    const data = response.data;
    if (!data || !data.title || !data.variants) {
      throw new Error("Invalid product data structure.");
    }

    return {
      title: data.title,
      description: data.description,
      price: data.variants[0]?.price,
      currency: data.currency || "USD",
      variants: data.variants,
      images: data.images,
      raw: data,
    };
  } catch (err) {
    throw new Error(`Failed to fetch Shopify product JSON: ${err.message}`);
  }
}

module.exports = { fetchShopifyProductData };