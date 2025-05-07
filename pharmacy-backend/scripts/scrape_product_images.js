const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const API_URL = 'http://localhost:3001/products';
const IMAGE_CACHE_DIR = path.join(__dirname, '../public/cached_product_images');

// Create cache dir if needed
if (!fs.existsSync(IMAGE_CACHE_DIR)) {
  fs.mkdirSync(IMAGE_CACHE_DIR, { recursive: true });
}

// Simulates a real browser to avoid being blocked
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36',
};

async function downloadImage(url, filename) {
  const imagePath = path.join(IMAGE_CACHE_DIR, filename);
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
    headers: HEADERS,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  await pipeline(response.data, fs.createWriteStream(imagePath));
}

async function fetchFirstImageUrl(productName) {
  const searchUrl = `https://www.ecosia.org/images?q=${encodeURIComponent(productName)}`;
  try {
    const response = await axios.get(searchUrl, { headers: HEADERS });
    const $ = cheerio.load(response.data);

    const img = $('img').filter((i, el) => {
      const src = $(el).attr('src') || '';
      return src.startsWith('https://') || src.startsWith('http://');
    }).first();

    const imageUrl = img.attr('src');
    return imageUrl;
  } catch (err) {
    console.error(`❌ Failed to fetch image for "${productName}":`, err.message);
    return null;
  }
}

async function scrapeAndSaveImages() {
  try {
    const { data: products } = await axios.get(API_URL);
    for (const product of products) {
      const imageFileName = `${product._id}.jpg`;
      const imagePath = path.join(IMAGE_CACHE_DIR, imageFileName);

      if (fs.existsSync(imagePath)) {
        console.log(`✔ Already cached: ${product.name}`);
        continue;
      }

      console.log(`🔍 Searching image for: ${product.name}`);
      const imageUrl = await fetchFirstImageUrl(product.name);

      if (!imageUrl) {
        console.warn(`⚠️ No image found for: ${product.name}`);
        continue;
      }

      try {
        await downloadImage(imageUrl, imageFileName);
        console.log(`✅ Saved image for: ${product.name}`);
      } catch (err) {
        console.error(`❌ Failed to download ${product.name}:`, err.message);
      }

      await new Promise((r) => setTimeout(r, 300)); // gentle delay
    }

    console.log('\n🎉 Done! All available images scraped and saved.');
  } catch (err) {
    console.error('🚨 Error fetching products:', err.message);
  }
}

scrapeAndSaveImages();
