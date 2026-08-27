function calculateRecommendedConcurrentAccounts({
  totalMemBytes: _0x12e8a1,
  cpuCores: _0x648d7a,
  maxAccounts = 10
} = {}) {
  const _0x4cbe06 = Number(_0x12e8a1) / 1024 / 1024 / 1024;
  const _0x21ee02 = Math.max(1, Number(_0x648d7a) || 1);
  const _0x4f015e = Math.max(1, Math.min(10, Math.floor(Number(maxAccounts) || 10)));
  const _0x1cfbde = !Number.isFinite(_0x4cbe06) || _0x4cbe06 < 12 ? 1 : _0x4cbe06 < 24 ? 2 : _0x4cbe06 < 48 ? 4 : _0x4cbe06 < 96 ? 6 : 8;
  const _0x43bbf7 = _0x21ee02 <= 4 ? 1 : _0x21ee02 <= 8 ? 3 : _0x21ee02 <= 12 ? 5 : 8;
  const _0xb7c8a5 = Math.max(1, Math.min(_0x4f015e, _0x1cfbde, _0x43bbf7));
  const _0x58e110 = _0xb7c8a5 <= 1 ? "low" : _0xb7c8a5 <= 3 ? "medium" : "high";
  return {
    recommendedConcurrentAccounts: _0xb7c8a5,
    performanceTier: _0x58e110,
    totalMemGB: Number.isFinite(_0x4cbe06) ? Number(_0x4cbe06.toFixed(1)) : 0,
    cpuCores: _0x21ee02
  };
}
function getLocalRecommendedConcurrentAccounts(_0x63db2a = 10) {
  const _0x16105d = require("os");
  return calculateRecommendedConcurrentAccounts({
    totalMemBytes: _0x16105d.totalmem(),
    cpuCores: _0x16105d.cpus().length,
    maxAccounts: _0x63db2a
  });
}
module.exports = {
  calculateRecommendedConcurrentAccounts: calculateRecommendedConcurrentAccounts,
  getLocalRecommendedConcurrentAccounts: getLocalRecommendedConcurrentAccounts
};