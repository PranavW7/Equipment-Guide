const express = require("express");
const router = express.Router();
const Laptop = require("../models/laptop");
const CPUBenchmark = require("../models/cpuBenchmark");
const GPUBenchmark = require("../models/gpuBenchmark");

const { laptopScore, parseName } = require("../compute_score");

// Getting all laptops from DB
router.get("/", async (req, res) => {
  try {
    const laptops = await Laptop.find();
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Computing scores for all the valid laptops
router.get("/compute-scores", async (req, res) => {
  try {
    // Get laptops with valid fields
    const validLaptops = await Laptop.find({
      "RAM Speed": { $exists: true },
      "Processor Model": { $exists: true },
      Processor: { $exists: true },
      "Graphics Processor": { $exists: true },
    });
    // console.log(ramSpeedExistingLaptops);

    // Check if the laptop cpus exist in the benchmark cpu list
    validLaptops.forEach(async (laptop) => {
      console.log("-------------------------------------------------");
      let laptopName = laptop["Name"];
      laptopName = laptopName.substring(0, laptopName.length - 30);
      let processorModel = laptop["Processor Model"];
      processorModel = processorModel.substring(1, processorModel.length - 1);
      const cpu = laptop["Processor"] + processorModel;
      let cpuName = parseName(cpu);
      console.table([cpu, cpuName]);

      const gpu = laptop["Graphics Processor"];
      let gpuName = parseName(gpu);

      let ramSize = laptop["RAM"];
      ramSize = ramSize.substring(1, ramSize.length - 3);
      let ramSpeed = laptop["RAM Speed"];
      ramSpeed = ramSpeed.substring(1, ramSpeed.length - 4);

      // Compute the score of the laptop with respect to a software
      let forza = {
        ram: 0.258,
        cpu: 0.637,
        gpu: 0.105,
      };

      let result = [];
      // If this cpu exists in the cpu benchmarks, only then compute the score, otherwise continue
      const cpuExists = await CPUBenchmark.findOne({ name: cpuName });
      const gpuExists = await GPUBenchmark.findOne({ name: gpuName });
      if (cpuExists && gpuExists) {
        const score = await laptopScore(forza, cpu, gpu, ramSize, ramSpeed);
        console.table([laptopName, cpu, gpu, ramSize, ramSpeed, score]);
        result.push({ cpu, score });
      }
    });
    console.log("Result", result);
    res.json(result);
  } catch (error) {}
});

// Scrape laptops from pricebaba
const { scrapeLaptops } = require("../scrapers/scrape-laptops");
router.get("/scrape-laptops", async (req, res) => {
  try {
    console.log("Scraping from pricebaba");
    await scrapeLaptops();
  } catch (error) {}
});

// Scrape from geekbench
const { scrapeCPUScores } = require("../scrapers/scrape-cpu-scores");
router.get("/scrape-cpu-scores", async (req, res) => {
  try {
    console.log("Scraping from geekbench");
    await scrapeCPUScores();
  } catch (error) {}
});

// Scrape cpu benchmarks
const { scrapeCPUBenchmarks } = require("../scrapers/scrape-cpu-benchmarks");
router.get("/scrape-cpu-benchmarks", async (req, res) => {
  try {
    await scrapeCPUBenchmarks();
  } catch (error) {}
});

// Scrape gpu benchmarks
const { scrapeGPUBenchmarks } = require("../scrapers/scrape-gpu-benchmarks");
const gpuBenchmark = require("../models/gpuBenchmark");
router.get("/scrape-gpu-benchmarks", async (req, res) => {
  try {
    await scrapeGPUBenchmarks();
  } catch (error) {}
});

// Getting one
router.get("/:id", getLaptop, async (req, res) => {
  // Get a laptop with certain ID
  const laptop = await res.laptop;

  // Parse cpu, gpu, ram-size and ram-speed
  let processorModel = laptop["Processor Model"];
  processorModel = processorModel.substring(1, processorModel.length - 1);
  const cpu = laptop["Processor"] + processorModel;
  const gpu = laptop["Graphics Processor"];
  let ramSize = laptop["RAM"];
  ramSize = ramSize.substring(1, ramSize.length - 3);
  let ramSpeed = laptop["RAM Speed"];
  ramSpeed = ramSpeed.substring(1, ramSpeed.length - 4);
  console.table([cpu, gpu, ramSize, ramSpeed]);

  // Pass in the software
  let software = {
    ram: "32GB",
    cpu: "Intel Core i9-12900HK",
    gpu: "Intel UHD 600",
  };

  // Compute the score of the laptop
  const score = laptopScore(software, cpu, gpu, ramSize, ramSpeed);
  res.json(res.laptop);
});

// Computing score for any laptop
router.get("/:id", getLaptop, async (req, res) => {
  const laptop = res.laptop;
  const laptopScore = await laptopScore(laptop);
  res.json(laptop.Name, laptopScore);
});

// Creating One
router.post("/", async (req, res) => {
  const laptop = new Laptop({
    name: req.body.name,
    cpu: req.body.cpu,
    ram: req.body.ram,
  });
  try {
    const newLaptop = await laptop.save();
    res.status(201).json(newLaptop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Updating one
router.patch("/:id", getLaptop, (req, res) => {});

// Deleting one
router.delete("/:id", getLaptop, async (req, res) => {
  try {
    await res.laptop.remove();
    res.json({ message: "Deleted laptop" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getLaptop(req, res, next) {
  let laptop;
  try {
    laptop = await Laptop.findById(req.params.id);
    if (laptop == null) {
      return res.status(404).json({ message: "Cannot find laptop" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.laptop = laptop;
  next();
}

// Get a laptop for computing score
router.get("/score", async (req, res) => {
  try {
    const laptops = await Laptop.find();
    const scores = [];
    laptops.forEach((laptop) => {
      console.log(laptop.Name);
      scores.push(
        laptop.Name,
        laptopScore(laptop.Processor, laptop["Graphics Processor"], laptop.RAM)
      );
      console.log(
        laptopScore(laptop.Processor, laptop["Graphics Processor"], laptop.RAM)
      );
    });
    res.json(scores);
  } catch (error) {}
});

module.exports = router;
