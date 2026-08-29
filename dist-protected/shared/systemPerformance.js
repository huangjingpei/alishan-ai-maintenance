function calculateRecommendedConcurrentAccounts({
  totalMemBytes: totalMemBytes,
  cpuCores: cpuCores,
  maxAccounts = 10
} = {}) {
  const value = Number(totalMemBytes) / 1024 / 1024 / 1024;
  const result = Math.max(1, Number(cpuCores) || 1);
  const result2 = Math.max(1, Math.min(10, Math.floor(Number(maxAccounts) || 10)));
  const value2 = !Number.isFinite(value) || value < 12 ? 1 : value < 24 ? 2 : value < 48 ? 4 : value < 96 ? 6 : 8;
  const value3 = result <= 4 ? 1 : result <= 8 ? 3 : result <= 12 ? 5 : 8;
  const result3 = Math.max(1, Math.min(result2, value2, value3));
  const value4 = result3 <= 1 ? "low" : result3 <= 3 ? "medium" : "high";
  return {
    recommendedConcurrentAccounts: result3,
    performanceTier: value4,
    totalMemGB: Number.isFinite(value) ? Number(value.toFixed(1)) : 0,
    cpuCores: result
  };
}
function getLocalRecommendedConcurrentAccounts(num = 10) {
  const os = require("os");
  return calculateRecommendedConcurrentAccounts({
    totalMemBytes: os.totalmem(),
    cpuCores: os.cpus().length,
    maxAccounts: num
  });
}
module.exports = {
  calculateRecommendedConcurrentAccounts: calculateRecommendedConcurrentAccounts,
  getLocalRecommendedConcurrentAccounts: getLocalRecommendedConcurrentAccounts
};