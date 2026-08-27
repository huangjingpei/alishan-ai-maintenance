function applyGpuStabilityBootFlags(_0x2aec7d, _0xe7cca5) {
  if (!_0x2aec7d || !_0xe7cca5) {
    return;
  }
  const _0x1700c9 = _0xe7cca5.get("system_hardware_acceleration", true);
  if (_0x1700c9 === false && process.platform === "win32") {
    _0x2aec7d.disableHardwareAcceleration();
    console.log("[GPU] 硬件加速已关闭（用户设置）");
    return;
  }
  if (_0x1700c9 === false && process.platform === "darwin") {
    _0xe7cca5.set("system_hardware_acceleration", true);
    console.log("[GPU] macOS 实况画面需要 GPU 合成，已恢复硬件加速");
  }
  if (process.platform === "darwin") {
    _0x2aec7d.commandLine.appendSwitch("enable-gpu-rasterization");
    _0x2aec7d.commandLine.appendSwitch("enable-zero-copy");
  }
  if (process.platform === "win32") {
    _0x2aec7d.commandLine.appendSwitch("use-angle", "d3d11");
    _0x2aec7d.commandLine.appendSwitch("disable-features", "Vulkan");
    console.log("[GPU] Windows 稳定性: ANGLE d3d11, Vulkan off");
  }
}
module.exports = {
  applyGpuStabilityBootFlags: applyGpuStabilityBootFlags
};