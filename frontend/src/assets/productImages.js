// src/assets/productImages.js
//
// Maps a product's name/category to one of the real photos already sitting
// in src/assets, instead of always falling back to the barcode scanner image.
//
// How it works:
// 1. Each entry below has a list of keywords.
// 2. getProductImage(product) lowercases the product's name (+ category) and
//    checks if any keyword for an image is contained in it.
// 3. First match wins. If nothing matches, we fall back to a neutral
//    placeholder (hero.png) instead of a random unrelated product photo.

import corrugatedBoxes from "./Corrugated Cardboard Boxes.jpg";
import packingTape from "./Heavy Duty Packing Tape.jpg";
import warehouseDolly from "./Heavy Duty Warehouse Dolly.jpg";
import hero from "./hero.png";
import safetyVest from "./High-Visibility Reflective Safety Vest.jpg";
import firstAidKit from "./Industrial First Aid Kit (50 Person).jpg";
import steelShelving from "./Industrial Steel Warehouse Shelving.jpg";
import bubbleWrap from "./Large Bubble Wrap Roll.jpg";
import barcodeScanner from "./Laser Handheld Barcode Scanner.jpg";
import safetyBoots from "./Steel-Toe Leather Safety Boots.jpg";
import labelPrinter from "./Thermal Label Printer.jpg";
import chargingDock from "./Universal Charging Station Dock.jpg";
import polyMailers from "./White Padded Poly Mailers.jpg";

// Order matters: more specific keyword sets should come first so they don't
// get shadowed by a broader match (e.g. "tape" appearing in two entries).
const IMAGE_RULES = [
  { image: bubbleWrap, keywords: ["bubble wrap", "bubble"] },
  { image: corrugatedBoxes, keywords: ["corrugated", "cardboard box", "shipping box", "carton"] },
  { image: packingTape, keywords: ["packing tape", "strapping tape", "sealing tape", "tape"] },
  { image: polyMailers, keywords: ["poly mailer", "mailer", "mailing bag"] },
  { image: warehouseDolly, keywords: ["dolly", "hand truck", "pallet jack"] },
  { image: steelShelving, keywords: ["shelving", "shelf", "rack"] },
  { image: safetyVest, keywords: ["safety vest", "hi-vis", "hi vis", "reflective vest", "vest"] },
  { image: safetyBoots, keywords: ["safety boot", "steel-toe", "steel toe", "boots"] },
  { image: firstAidKit, keywords: ["first aid"] },
  { image: labelPrinter, keywords: ["label printer", "thermal label", "thermal printer"] },
  { image: chargingDock, keywords: ["charging station", "charging dock", "charger dock"] },
  { image: barcodeScanner, keywords: ["barcode", "scanner"] },
];

// Fallback when nothing matches — a neutral brand image rather than an
// unrelated product photo (previously this was always the barcode scanner).
const FALLBACK_IMAGE = hero;

export function getProductImage(product) {
  if (!product) return FALLBACK_IMAGE;

  // 1. Explicit imageUrl set on the product (e.g. pasted a link) always wins.
  if (product.imageUrl) return product.imageUrl;

  // 2. Try to match by name + category against our keyword rules.
  const haystack = `${product.name || ""} ${product.category || ""}`.toLowerCase();

  for (const rule of IMAGE_RULES) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return rule.image;
    }
  }

  // 3. No match found — use the neutral fallback, not a random product photo.
  return FALLBACK_IMAGE;
}