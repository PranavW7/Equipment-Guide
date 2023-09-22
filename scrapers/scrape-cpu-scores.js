// Scraping geekbench data
const axios = require("axios");
const cheerio = require("cheerio");

const GeekBenchScore = require("../models/geekbenchScores");


const scrapeCPUScores = async () => {
  await GeekBenchScore.deleteMany({});

  const url = "https://browser.geekbench.com/processor-benchmarks";
  axios.get(url).then((response) => {
    const $ = cheerio.load(response.data);
    const benchmarkTable =
      "body.rosedale > #wrap > div.row > div.primary > div.tabbable > div.tab-content > #multi-core > div.table-wrapper > table > tbody";
    $(benchmarkTable).each((parentIndex, parentElement) => {
      $(parentElement)
        .children()
        .each((childIndex, childElement) => {
          const row = benchmarkTable + "> tr:nth-child(" + (childIndex + 1).toString() + ")";
          const name = row + "> td.name > a";
          const score = row + "> td.score";

          //   console.log("Name", $(name).text())
          //   console.log("Score", $(score).text());

          const cpuScore = new GeekBenchScore();
          cpuScore.name = $(name).text().substring(1, $(name).text().length-1);
          cpuScore.score = $(score).text();
          console.log(cpuScore);
          cpuScore.save();
        });
    });
  });
};

module.exports = { scrapeCPUScores };
