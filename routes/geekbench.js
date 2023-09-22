const { default: axios } = require('axios');
const express = require('express')
const router = express.Router()
const cheerio = require("cheerio");

const cpuScore = require('../models/geekbenchScores');
const GeekBenchScore = require('../models/geekbenchScores');


router.get('/', async (req, res) => {
    try {
        const url = "https://browser.geekbench.com/processor-benchmarks";
        axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const benchmarkTable = 'div.rosedale > #wrap > div.row > div.primary > div.tabbable > div.tab-content > div.multi-core > div.table-wrapper > table > tbody';
            $(benchmarkTable).each((parentIndex, parentElement) => {
                $(parentElement).children()
                .each((childIndex, childElement) => {
                    const row = benchmarkTable + '> tr:nth-child(' + (childIndex+1).toString() + ')';
                    const name = row + '> td.name + a';
                    const cpuScore = new GeekBenchScore();
                    cpuScore.name = $(name).text();
                    cpuScore.score = $(row + '> td.score').text();
                    cpuScore.save();
                })
            })
        });
    } catch (error) {
        
    }
});


module.exports = router;

