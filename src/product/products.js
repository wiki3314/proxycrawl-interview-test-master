const Product = require("../model/product");
async function allProduct(req, res) {
  console.log("all product api");

  try {
    const products = await Product.find({});
    return res.status(201).json({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = allProduct;
