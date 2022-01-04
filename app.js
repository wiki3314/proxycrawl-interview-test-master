const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Middleware
const Agenda = require("agenda");
const axios = require("axios");

const ScraperAPI = require("./scraper-api.js");
const { test } = require("./config.js");
const { routes } = require("./app.routes");
// const connectToDb = require("./db");

const app = express();
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/test", options)
  .then((db) => {
    console.log(`Database URI: mongodb://localhost:27017`);
    console.log(
      `Connected to Mongo! Database name: "${db.connections[0].name}"`
    );
    app.use("/", routes({ db }));
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });
mongoose.connection.on("open", () => {
  console.log("Database connected");
});

mongoose.connection.on("close", () => {
  console.log("Database disconnected");
});

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Database connection disconnected through app termination");
    process.exit(0);
  });
});

if (test.normalToken === "" || test.javascriptToken === "") {
  console.error(
    "Please add a test normal token and javascript token in src/config.js to run tests"
  );
  process.exit(1);
}
const mongoConnectionString = "mongodb://localhost:27017/test";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("Scrape Urls Scheduling", async (job, done) => {
  console.log(`AGENDA JOB: Scrape Urls Scheduling`);
  const response = await axios.get(`http://localhost:3000/scraper`);
  console.log(response.data);
  done();
});
(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  await agenda.every("1 0 * * 1", "Scrape Urls Scheduling");
})();

const server = http.createServer(app);

const port = 3000;
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.listen(port, () => {
  console.log(`\x1b[32m`, `Server listening on ${port}`, `\x1b[0m`);
});
