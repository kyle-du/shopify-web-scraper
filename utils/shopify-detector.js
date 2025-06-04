const axios = require("axios");
const cheerio = require("cheerio");

async function isShopifyPage(url) {
  try {
    const { data: html } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(html);
    const hasMeta = $('meta[name="shopify-digital-wallet"]').length > 0;
    const hasShopifyCDN = $('link[href*="cdn.shopify.com"], script[src*="cdn.shopify.com"]').length > 0;
    return hasMeta || hasShopifyCDN;
  } catch (err) {
    return false;
  }
}

module.exports = { isShopifyPage };