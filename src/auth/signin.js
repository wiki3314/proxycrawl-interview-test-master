const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function signIn(req, res) {
  console.log("signin api");

  try {
    // Get user input
    const { email, password } = req.body;
    console.log("body", req.body);

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ email }, "CrawelTest", {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;

      return res.status(201).json({
        success: true,
        message: "successfully login",
        user: {
          username: user.username,
          email: user.email,
          token: user.token,
        },
      });
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

module.exports = signIn;
