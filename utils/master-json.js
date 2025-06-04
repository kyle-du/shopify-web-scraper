function generateMasterProductJSON(data, sourceUrl) {
  const priceValues = data.variants.map(v => parseFloat(v.price));
  const priceMin = Math.min(...priceValues);
  const priceMax = Math.max(...priceValues);

  const masterJSON = {
    title: data.title || "",
    handle: data.handle || "",
    vendor: data.vendor || "",
    product_type: data.type || data.product_type || "",
    description: stripHtml(data.description || data.body_html),
    price_min: priceMin,
    price_max: priceMax,
    currency: data.currency || "USD",
    images: (data.images || []).map(img => (typeof img === "string" ? normalizeUrl(img) : img.src)),
    variants: data.variants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      available: v.available,
      sku: v.sku || "",
      option_values: (data.options || []).reduce((acc, optionName, idx) => {
        acc[optionName] = v[`option${idx + 1}`] || null;
        return acc;
      }, {})
    })),
    options: data.options || [],
    tags: data.tags || [],
    source_url: sourceUrl
  };

  return masterJSON;
}

function normalizeUrl(url) {
  if (!url) return null;
  if (url.startsWith("//")) return "https:" + url;
  return url;
}

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

module.exports = { generateMasterProductJSON };