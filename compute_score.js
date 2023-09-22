const CPUBenchmark = require("./models/cpuBenchmark");
const GPUBenchmark = require("./models/gpuBenchmark");

const getBenchmarkRank = async (cpuScore) => {
  console.log("Get rank by score", cpuScore);
  //   const await GeekBenchCPUScore.find({"score": {"$lt": 500}}).count();
  return 361;
};

const parseName = (name) => {
  let parsedName = name;
  parsedName = parsedName.replace(/\s*\([^)]*\)\s*/g, "");
  parsedName = parsedName.replace(/\s/g, "");
  parsedName = parsedName.replace("-", "");
  parsedName = parsedName.replace(" ", "");
  parsedName = parsedName.toLowerCase();
  return parsedName;
};

const getCPUBenchmarkScore = async (cpu) => {
  console.log("CPU benchmark score", cpu);
  // let cpuName = softwareCPU;
  // cpuName = cpuName.replace(/\s*\([^)]*\)\s*/g, '');
  // cpuName = cpuName.replace(/\s/g, "");
  // cpuName = cpuName.replace("-", "");
  // cpuName = cpuName.toLowerCase();
  let cpuName = parseName(cpu);
  console.log(cpuName);
  const foundCPU = await CPUBenchmark.findOne({ name: cpuName });
  let cpuScore = foundCPU["score"];
  cpuScore = cpuScore.replace(",", "");
  return cpuScore;
};


const getTotalCPUs = () => {
  return 1135;
};

const getMaxScoreofCPUs = () => {
  return 66655;
};

// Compute the CPU and GPU score of the laptop based on a given software
const computeCPUScore = async (software, cpu) => {
  console.log("======= Compute CPU Score =======");

  // const softwareCPUScore = await getCPUBenchmarkScore(software.cpu);
  console.log("SW cpu weight", software.cpu);
  // const softwareCPURank = await getBenchmarkRank(softwareCPUScore);
  
  let laptopCPU = cpu;
  laptopCPU = laptopCPU.substring(1, laptopCPU.length - 2);
  const laptopCPUScore = await getCPUBenchmarkScore(cpu);
  console.log("Laptop cpu score", laptopCPUScore);
  const total = getTotalCPUs();
  const maxScore = getMaxScoreofCPUs();
  
  const weightageFactor = software.cpu;
  console.log("CPU weightage", weightageFactor);
  
  const relativityFactor = laptopCPUScore / maxScore;
  console.log("CPU relativity", relativityFactor);
  
  const Score = weightageFactor * relativityFactor;
  console.log("Final CPU Score", Score);
  return Score;
};

/* ------------------------------- GPU Calculation --------------------------------------- */
const getGPUBenchmarkScore = async (gpu) => {
  console.log("GPU benchmark score", gpu);
  let gpuName = parseName(gpu);
  console.log(gpuName);
  const foundGPU = await GPUBenchmark.findOne({ name: gpuName });
  let gpuScore = foundGPU["score"];
  gpuScore = gpuScore.replace(",", "");
  return gpuScore;
};

const computeGPUScore = async (software, gpu) => {
  console.log("======= Compute GPU Score =======");

  // const sofwareGPUScore = await getGPUBenchmarkScore(software.gpu);
  const laptopGPUScore = await getGPUBenchmarkScore(gpu);
  console.log("Laptop gpu score", laptopGPUScore);


  const weightageFactor = software.gpu;
  const relativityFactor = laptopGPUScore / 21036.0;

  const Score = weightageFactor * relativityFactor;
  console.log("Final GPU Score", Score);

  return Score;
}

/* ------------------------------- RAM Calculation --------------------------------------- */


const softwareRamWeightage = {
  64: 1,
  32: 2,
  16: 3,
  8: 4,
  4: 5,
  2: 6,
};

const relativeRamFactor = [
  { "64 GB": 6 },
  { "32 GB": 5 },
  { "16 GB": 4 },
  { "8 GB": 3 },
  { "4 GB": 2 },
  { "2 GB": 1 },
];

const frequencyVsCASLatency = {
  1600: 11,
  1866: 13,
  2133: 15,
  2400: 16,
  2666: 15,
  2800: 15,
  3000: 15,
  3200: 15,
  3300: 16,
  3333: 16,
  3400: 16,
  3466: 17,
  3600: 16,
  3733: 17,
  3866: 18,
  4000: 17,
  4133: 19,
  4200: 19,
};

const computeRAMScore = (software, ramSize, ramSpeed) => {
  console.log("======= Compute RAM Score =======");

  const totalRAMs = 6;
  const maxRAMSize = 64;

  // const softwareRAM = software.ram.substring(0, software.ram.length - 2);

  // A - weightage factor
  const weightageFactor = software.ram;
  console.log("RAM Weightage", weightageFactor);

  // B - bandwidth calculation = processor-clock-speed * 2 transfers (DDR) * 64-bit on each * 2 (dual channel)
  // Number of slots
  const bandwidth = (ramSpeed * 2) / 1000000;
  console.log("RAM Bandwidth", bandwidth);

  // C - relative factor
  // Max ram size from within a laptop selection
  const relativity = ramSize / maxRAMSize;
  console.log("RAM Relativity", relativity);

  // D - latency
  const latency = ramSpeed / frequencyVsCASLatency[ramSpeed] ? frequencyVsCASLatency[ramSpeed] : 15;
  console.log("RAM Latency", latency);

  const totalRAMScore = weightageFactor * bandwidth * relativity * latency;
  console.log("RAM Score", totalRAMScore);
  return totalRAMScore;
};

// Compute the laptop score as the sum of CPU score, GPU score and RAM score
const laptopScore = async (software, cpu, gpu, ramSize, ramSpeed) => {
  console.log("======= Compute Score =======");
  const laptopScore =
    (await computeCPUScore(software, cpu)) +
    (await computeGPUScore(software, gpu)) +
    computeRAMScore(software, ramSize, ramSpeed);

  return laptopScore;
};

module.exports = { laptopScore: laptopScore, parseName: parseName };
