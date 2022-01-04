const Product = require("../model/product");

async function editProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    console.log("body", req.params);

    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: { name, description, price } },
      { new: true }
    );
    console.log("product", product);

    res.status(201).json({
      success: true,
      message: "successfully update Product",
      product,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
}

module.exports = editProduct;
