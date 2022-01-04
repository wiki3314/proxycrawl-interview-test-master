const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String },
  mainImage: { type: String },

  images: [{ type: String }],
  price: { type: String },
  description: { type: String },
  brand: { type: String },

  features: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
