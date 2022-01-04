const Product = require("../model/product");

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    console.log("body", req.params);

    const product = await Product.findOneAndDelete({ _id: id });

    res.status(201).json({
      success: true,
      message: "successfully Delete Product",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
}

module.exports = deleteProduct;
