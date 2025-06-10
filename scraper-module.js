const { findStoreDomain, findProductPages } = require("./utils/google-cse");
const { isShopifyPage } = require("./utils/shopify-detector");
const { fetchShopifyProductData } = require("./utils/shopify-fetcher");
const { generateMasterProductJSON } = require("./utils/master-json.js");
const fs = require("fs");

const num_results = 2;

async function scrapeProduct({ store, product }) {
  if (!store || !product) {
    throw new Error("Input must include both 'store' and 'product'.");
  }

  console.log("Received:", { store, product });

  const domain = await findStoreDomain(store);
  if (!domain) throw new Error("Could not find official site for store");

  console.log("Store domain:", domain);

  const productPages = await findProductPages(domain, product, num_results);
  console.log("Product page candidates:", productPages);

  const validShopifyUrls = [];
  for (const url of productPages) {
    const valid = await isShopifyPage(url);
    console.log(`${url} is ${valid ? "" : "not "}a Shopify page`);
    if (valid) validShopifyUrls.push(url);
  }

  if (validShopifyUrls.length === 0) {
    throw new Error("No valid Shopify product URLs found.");
  }

  const productData = await fetchShopifyProductData(validShopifyUrls[0]);
  console.log("Parsed Shopify product data:");
  console.dir(productData, { depth: null });

  const master_json = generateMasterProductJSON(productData.raw, validShopifyUrls[0]);
  const outputPath = `data/${master_json.title}.json`;
  fs.writeFileSync(outputPath, JSON.stringify([master_json], null, 2));

  console.log(`Master JSON saved to ${outputPath}`);
  return outputPath;
}

module.exports = { scrapeProduct };