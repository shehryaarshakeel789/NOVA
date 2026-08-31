import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

const menItems = [
  "T-Shirt",
  "Hoodie",
  "Bomber Jacket",
  "Jeans",
  "Chinos",
  "Sweater",
  "Shorts",
  "Polo Shirt",
  "Button-Up Shirt",
  "Joggers",
  "Denim Jacket",
  "Coat",
];

const womenItems = [
  "Slip Dress",
  "Blouse",
  "Midi Skirt",
  "Jeans",
  "Sweater",
  "Jacket",
  "Crop Top",
  "Cardigan",
  "Leggings",
  "Trench Coat",
  "Wide Leg Trousers",
  "Wrap Dress",
];

const adjectives = [
  "Classic",
  "Relaxed Fit",
  "Slim Fit",
  "Oversized",
  "Essential",
  "Tailored",
  "Vintage Wash",
  "Modern",
  "Casual",
  "Premium",
];

const colors = [
  "black",
  "white",
  "navy",
  "olive",
  "grey",
  "beige",
  "red",
  "blue",
  "forest green",
  "brown",
  "pink",
  "cream",
];

const sizeSets = {
  men: ["S", "M", "L", "XL"],
  women: ["XS", "S", "M", "L"],
};

const tagMap = {
  "T-Shirt": "mens t-shirt",
  Hoodie: "hoodie",
  "Bomber Jacket": "mens jacket",
  Jeans: "jeans",
  Chinos: "chino pants",
  Sweater: "sweater",
  Shorts: "shorts",
  "Polo Shirt": "polo shirt",
  "Button-Up Shirt": "dress shirt",
  Joggers: "sweatpants",
  "Denim Jacket": "denim jacket",
  Coat: "coat",
  "Slip Dress": "dress",
  Blouse: "blouse",
  "Midi Skirt": "skirt",
  "Crop Top": "crop top",
  Cardigan: "cardigan",
  Leggings: "leggings",
  "Trench Coat": "trench coat",
  "Wide Leg Trousers": "womens trousers",
  "Wrap Dress": "wrap dress",
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchImagesForTag(tag) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    tag,
  )}&per_page=6&client_id=${UNSPLASH_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.log(
      `Failed to fetch images for "${tag}", status ${response.status}`,
    );
    return [];
  }
  const data = await response.json();
  return data.results.map((photo) => `${photo.urls.small}`);
}

// Builds a { tag: [imageUrl, imageUrl, ...] } lookup, one request per unique tag
async function buildImagePools() {
  const uniqueTags = [...new Set(Object.values(tagMap))];
  const pools = {};

  for (const tag of uniqueTags) {
    console.log(`Fetching images for: ${tag}`);
    pools[tag] = await fetchImagesForTag(tag);
    // Unsplash's rate limit is per-hour, but a small delay is a courteous default
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return pools;
}

function generateProducts(count, imagePools) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const category = i % 2 === 0 ? "men" : "women";
    const items = category === "men" ? menItems : womenItems;

    const item = randomFrom(items);
    const adjective = randomFrom(adjectives);
    const color = randomFrom(colors);
    const tag = tagMap[item];
    const pool = imagePools[tag];

    const image = pool && pool.length > 0 ? randomFrom(pool) : null;

    products.push({
      name: `${adjective} ${item}`,
      description: `A ${adjective.toLowerCase()} ${item.toLowerCase()} in ${color}, designed for everyday comfort and versatile styling.`,
      price: Math.floor(Math.random() * (120 - 25 + 1)) + 25,
      images: image ? [image] : [],
      category,
      color,
      sizes: sizeSets[category].map((size) => ({
        size,
        stock: Math.floor(Math.random() * 20) + 1,
      })),
      isNewArrival: Math.random() < 0.2,
      isOnSale: Math.random() < 0.15,
    });
  }

  return products;
}

async function seed() {
  try {
    if (!UNSPLASH_KEY) {
      throw new Error("Missing UNSPLASH_ACCESS_KEY in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const imagePools = await buildImagePools();

    await Product.deleteMany({});
    console.log("Existing products cleared");

    const products = generateProducts(140, imagePools);
    const created = await Product.insertMany(products);
    console.log(`${created.length} products inserted`);

    await mongoose.disconnect();
    console.log("Done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
