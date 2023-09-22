const mongoose = require('mongoose');

// Define a schema for the scraped data
const cpuBenchmarkSchema = new mongoose.Schema({
    name: String,
    score: String,
  });

// Create a model from the schema
module.exports = mongoose.model('CPUBenchmark', cpuBenchmarkSchema);