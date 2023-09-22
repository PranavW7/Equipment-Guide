const axios = require("axios");
const cheerio = require("cheerio");

const CPUBenchmark = require("../models/cpuBenchmark");

const scrapeCPUBenchmarks = async() => {
    await CPUBenchmark.deleteMany({});

    // Fetch the HTML from the website
    const response = await axios.get('https://www.cpubenchmark.net/laptop.html');
    const html = response.data;
    
    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    console.log("Scrape CPU benchmarks")
    
    // Extract the CPU names and scores
    const cpuPathBase = "body > div.block_content > div.container > #main_content > div.wrapper > div.main-cmps > div.charts > #mark > div.chart > div.chart_body > ul.chartlist";
    $(cpuPathBase).each((i, el) => {
      $(el).children().each((i, el) => {
        const list = cpuPathBase + '> li:nth-child(' + (i+1).toString() + ')';
        const namePath = list + '> a > span.prdname';
        let name = $(namePath).text();
        const scorePath = list + '> a > span.count';
        const score = $(scorePath).text();

        
        name = name.replace(/\s/g, '');
        name = name.replace('-', '');
        name = name.toLowerCase();
        
        console.log(name, score);
        const cpuBenchmark = new CPUBenchmark();
        cpuBenchmark.name = name;
        cpuBenchmark.score = score;
        cpuBenchmark.save();
      })
    });

}

module.exports = { scrapeCPUBenchmarks }