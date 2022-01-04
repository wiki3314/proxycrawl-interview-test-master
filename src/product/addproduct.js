const Product = require("../model/product");

async function addProduct(req, res) {
  try {
    const { name, description, price } = req.body;
    console.log("body", req.body);

    if (!(name && description && price)) {
      res.status(400).send("All input is required");
    }

    const product = await Product.create({
      name,
      description,
      price,
    });
    console.log("product", product);

    res.status(201).json({
      success: true,
      message: "successfully Add Product",
      product,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, err });
  }
}

module.exports = addProduct;
