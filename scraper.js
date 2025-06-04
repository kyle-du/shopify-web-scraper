#!/usr/bin/env node

const { extractStoreAndProduct } = require("./utils/openai");
const { findStoreDomain, findProductPages } = require("./utils/google-cse");
const { isShopifyPage } = require("./utils/shopify-detector");
const { fetchShopifyProductData } = require("./utils/shopify-fetcher");
const { generateMasterProductJSON } = require("./utils/master-json.js")
const fs = require("fs");

const num_results = 2;

(async () => {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) {
    console.error("Provide arguments.");
  }

  const { store, product } = await extractStoreAndProduct(prompt);
  console.log("Extracted:", { store, product });

  const domain = await findStoreDomain(store);
  if (!domain) return console.error("Could not find official site");

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
    console.error("No valid Shopify product URLs found.");
    return;
  }

  try {
    const productData = await fetchShopifyProductData(validShopifyUrls[0]);
    console.log("Parsed Shopify product data:");
    console.dir(productData, { depth: null });

    const master_json = generateMasterProductJSON(productData.raw, validShopifyUrls[0]);
    fs.writeFileSync("data/" + master_json.title + ".json", JSON.stringify([master_json], null, 2));
  } catch (err) {
    console.error("Failed to fetch product JSON:", err.message);
  }
})();