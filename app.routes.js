/* eslint-disable no-unused-vars */
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const scrapPages = require("./src/scraper/scrapper");
const signIn = require("./src/auth/signin");
const signUp = require("./src/auth/signup");

const addProduct = require("./src/product/addproduct");
const deleteproduct = require("./src/product/deleteproduct");
const editProduct = require("./src/product/editProduct");
const product = require("./src/product/products");

function authenticate(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } // decode refresh token
  if (token) {
    // verifies secret and checks exp
    return jwt.verify(token, "CrawelTest", (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Unauthorized access.",
          errorMessage: err.message,
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      error: true,
      message: "No token provided.",
    });
  }
  next();
}

const routes = (db) => {
  const api = express.Router();
  api.get("/health-check", (req, res) => res.send("OK"));
  api.get("/login", (req, res) => {
    //res.sendFile(__dirname + '/static/login.html');
    res.sendFile(__dirname + "/login.html");
  });

  api.get("/signin", (req, res) => {
    //res.sendFile(__dirname + '/static/login.html');
    res.sendFile(__dirname + "/signin.html");
  });

  api.post("/scraper", scrapPages);

  api.post("/signup", signUp);

  api.post("/signin", signIn);

  api.get("/product", authenticate, product);

  api.get("/product/add", (req, res) => {
    //res.sendFile(__dirname + '/static/login.html');
    res.sendFile(__dirname + "/Add.html");
  });
  api.get("/product/delete", (req, res) => {
    //res.sendFile(__dirname + '/static/login.html');
    res.sendFile(__dirname + "/Delete.html");
  });
  api.get("/product/update", (req, res) => {
    //res.sendFile(__dirname + '/static/login.html');
    res.sendFile(__dirname + "/Update.html");
  });
  /** GET /health-check - Check service health */

  api.post("/product/add", authenticate, addProduct);
  api.put("/product/:id", authenticate, editProduct);
  api.delete("/product/:id", authenticate, deleteproduct);

  return api;
};

exports.routes = routes;
