const ScraperAPI = require("../../scraper-api.js");
const { test } = require("../../config.js");
const Product = require("../model/product");
async function getData(body) {
  let { name, price, images, description, mainImage, brand, features } = body;
  console.log("body", body);
  return Product.findOne({ name })
    .then((product) => {
      if (!product) {
        return Product.create({
          name,
          price,
          images,
          description,
          mainImage,
          brand,
          features,
        })
          .then((newProduct) => {
            return newProduct;
          })
          .catch((err) => console.log("product can't inserted", err));
      }
      return product;
    })
    .catch((error) => console.log("product find error", error));
}

function processSuccessResponse(response) {
  if (response.statusCode === 200) {
    if (undefined !== response.json) {
      getData(response.json.body);
    } else {
      getData(response.body);
    }
    console.log("Processed passed");
  } else {
    console.error(
      "Process failed, expected statusCode 200 got " + response.statusCode
    );
  }
}

const processError = (error) => {
  console.error("Process failed: " + error);
};

const urls = [
  "https://www.amazon.com/Halo-SleepSack-Swaddle-Triangle-Neutral/dp/B01LAG1TOS",
  "https://www.amazon.com/Amazing-Baby-Transitional-Half-Length-Sterling/dp/B07Y94D1MT",
  "https://www.amazon.com/Moon-Back-Hanna-Andersson-Wearable/dp/B07NYV3H7Z",
  "https://www.amazon.com/Sumersault-Blanket-Embroidery-Microfleece-Wearable/dp/B084CCPVNX",
  "https://www.amazon.com/Amazing-Baby-Adjustable-Butterum-Sterling/dp/B07765YMLH",
  "https://www.amazon.com/SAMSUNG-27-inch-Streaming-Tunerless-LS27AM500NNXZA/dp/B08JX2J5T4",
];

async function scrapPages(req, res) {
  console.log("scraper api");
  const scraperAPI = new ScraperAPI({ token: test.normalToken });
  try {
    const promises = await urls.map(async (url) => {
      const response = await scraperAPI.get(url);
      const data = await processSuccessResponse(response);
      return data;
    });

    const pagesResult = await Promise.all(promises);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "scrapping urls done ",
    });
  } catch (error) {
    processError(error);
  }
}

module.exports = scrapPages;
