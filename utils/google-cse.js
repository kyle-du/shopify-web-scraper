const axios = require("axios");
require("dotenv").config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX_ID;

async function googleSearch(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${CX}`;
  const res = await axios.get(url);
  return res.data.items || [];
}

async function findStoreDomain(store) {
  // Temporary fallback: returns the raw store name directly.
  // TODO: Replace with a proper Google CSE query to accurately resolve the official store domain.
  // Current workaround due to issues with the CSE configuration, kept returning social media URLs unlike regular browser SE.
  return store;
}

async function findProductPages(domain, product, num_query) {
  console.log("domain: ", domain, " product: ", product);
  const results = await googleSearch(`${domain} ${product}`);
  return results.slice(0, num_query).map(r => r.link);
}

module.exports = { findStoreDomain, findProductPages };