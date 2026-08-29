function applyGpuStabilityBootFlags(arg1, arg2) {
  if (!arg1 || !arg2) {
    return;
  }
  const result = arg2.get("system_hardware_acceleration", true);
  if (result === false && process.platform === "win32") {
    arg1.disableHardwareAcceleration();
    console.log("[GPU] 硬件加速已关闭（用户设置）");
    return;
  }
  if (result === false && process.platform === "darwin") {
    arg2.set("system_hardware_acceleration", true);
    console.log("[GPU] macOS 实况画面需要 GPU 合成，已恢复硬件加速");
  }
  if (process.platform === "darwin") {
    arg1.commandLine.appendSwitch("enable-gpu-rasterization");
    arg1.commandLine.appendSwitch("enable-zero-copy");
  }
  if (process.platform === "win32") {
    arg1.commandLine.appendSwitch("use-angle", "d3d11");
    arg1.commandLine.appendSwitch("disable-features", "Vulkan");
    console.log("[GPU] Windows 稳定性: ANGLE d3d11, Vulkan off");
  }
}
module.exports = {
  applyGpuStabilityBootFlags: applyGpuStabilityBootFlags
};