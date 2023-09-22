const axios = require("axios");
const cheerio = require("cheerio");

const GPUBenchmark = require("../models/gpuBenchmark");

const scrapeGPUBenchmarks = async () => {
	console.log("Scrape GPU benchmarks");
	
	// Fetch the HTML
	const response = await axios.get("https://laptopmedia.com/top-laptop-graphics-ranking");
  const html = response.data;

  // Load the HTML into Cheerio
  const $ = cheerio.load(html);


  // Extract the GPU names and scores
  const gpuPathBase = "body > section > section > div.w-full > div.gpu-top-ranking > table > tbody";
  $(gpuPathBase).each((i, el) => {
    $(el)
      .children()
      .each((i, el) => {
        const row = gpuPathBase + "> #vc_" + (i + 1).toString();
        const namePath = row + "> td:nth-child(2) > a";
        let name = $(namePath).text();

        console.log(name);
      });
  });
};

module.exports = { scrapeGPUBenchmarks };
