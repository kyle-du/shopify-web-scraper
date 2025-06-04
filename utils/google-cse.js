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
  const results = await googleSearch(`${store} official site`);
  return results.length > 0 ? new URL(results[0].link).origin : null;
}

async function findProductPages(domain, product, num_query) {
  const results = await googleSearch(`site:${domain} ${product}`);
  return results.slice(0, num_query).map(r => r.link);
}

module.exports = { findStoreDomain, findProductPages };