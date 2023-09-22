
require("dotenv").config();

PORT = 3000;
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const laptopsRouter = require("./routes/laptops");
const geekbenchCPURouter = require("./routes/geekbench");
app.use("/laptops", laptopsRouter);
app.use("/geekbench", geekbenchCPURouter);

const Laptop = require("./models/laptop");
const { exists } = require("./models/laptop");

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
