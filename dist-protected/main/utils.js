const {
  app
} = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const {
  machineIdSync
} = require("node-machine-id");
let cachedDeviceId = null;
const BLOB_PREFIX = "ssv1:";
function getAppVersion() {
  try {
    const value = app.isPackaged ? path.join(app.getAppPath(), "package.json") : path.join(__dirname, "..", "package.json");
    return JSON.parse(fs.readFileSync(value, "utf8")).version;
  } catch (error) {
    return app.getVersion();
  }
}
function getDeviceIdFilePath() {
  return path.join(app.getPath("userData"), "device_id");
}
function getDeviceIdSealPath() {
  return path.join(app.getPath("userData"), "device_id.ms");
}
function isEphemeralFallbackId(arg1) {
  return /^fallback_id_\d+$/.test(arg1);
}
function isValidDeviceId(arg1) {
  if (!arg1 || typeof arg1 !== "string") {
    return false;
  }
  const result = arg1.trim();
  if (result.length < 16 || result.length > 128) {
    return false;
  }
  if (isEphemeralFallbackId(result)) {
    return false;
  }
  return /^[a-f0-9]+$/i.test(result);
}
function isEncryptedBlob(arg1) {
  return typeof arg1 === "string" && arg1.startsWith(BLOB_PREFIX);
}
function encryptionAvailable() {
  try {
    const {
      safeStorage: safeStorage
    } = require("electron");
    if (typeof app.isReady === "function" && !app.isReady()) {
      return false;
    }
    return !!safeStorage && typeof safeStorage.isEncryptionAvailable === "function" && !!safeStorage.isEncryptionAvailable();
  } catch (error) {
    return false;
  }
}
function encodeBlob(arg1) {
  const {
    safeStorage: safeStorage
  } = require("electron");
  const result = safeStorage.encryptString(String(arg1));
  return BLOB_PREFIX + Buffer.from(result).toString("base64");
}
function decodeBlob(arg1) {
  const {
    safeStorage: safeStorage
  } = require("electron");
  const result = String(arg1).slice(BLOB_PREFIX.length);
  const result2 = Buffer.from(result, "base64");
  return safeStorage.decryptString(result2);
}
function computeHardwareDeviceId() {
  const result = machineIdSync();
  const os = require("os");
  const local = os.cpus()[0]?.model || "unknown_cpu";
  const result2 = os.totalmem().toString();
  return crypto.createHash("sha256").update(result + local + result2).digest("hex");
}
function computeMachineSeal(arg1) {
  return crypto.createHash("sha256").update(machineIdSync() + "\n" + arg1).digest("hex");
}
function readSealFile() {
  try {
    const result = getDeviceIdSealPath();
    if (!fs.existsSync(result)) {
      return null;
    }
    const result2 = fs.readFileSync(result, "utf8").trim();
    if (/^[a-f0-9]{64}$/i.test(result2)) {
      return result2.toLowerCase();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
function writeSealFile(arg1) {
  try {
    const result = app.getPath("userData");
    fs.mkdirSync(result, {
      recursive: true
    });
    const result2 = getDeviceIdSealPath();
    const value = result2 + "." + process.pid + ".tmp";
    fs.writeFileSync(value, computeMachineSeal(arg1), "utf8");
    fs.renameSync(value, result2);
  } catch (error) {
    console.warn("[DeviceID] seal persist failed:", error.message);
  }
}
function atomicWriteFile(arg1, arg2) {
  const result = path.dirname(arg1);
  fs.mkdirSync(result, {
    recursive: true
  });
  const value = arg1 + "." + process.pid + ".tmp";
  fs.writeFileSync(value, arg2, "utf8");
  fs.renameSync(value, arg1);
}
function readPersistedDeviceIdRaw() {
  try {
    const result = getDeviceIdFilePath();
    if (!fs.existsSync(result)) {
      return {
        id: null,
        encrypted: false
      };
    }
    const result2 = fs.readFileSync(result, "utf8").trim();
    if (!result2) {
      return {
        id: null,
        encrypted: false
      };
    }
    if (isEncryptedBlob(result2)) {
      if (!encryptionAvailable()) {
        return {
          id: null,
          encrypted: true,
          pendingDecrypt: true,
          blob: result2
        };
      }
      try {
        const result = decodeBlob(result2).trim();
        if (isValidDeviceId(result)) {
          return {
            id: result,
            encrypted: true
          };
        } else {
          return {
            id: null,
            encrypted: true
          };
        }
      } catch (error) {
        console.warn("[DeviceID] decrypt failed (possible cross-machine copy):", error.message);
        return {
          id: null,
          encrypted: true,
          decryptFailed: true
        };
      }
    }
    if (isValidDeviceId(result2)) {
      return {
        id: result2,
        encrypted: false
      };
    } else {
      return {
        id: null,
        encrypted: false
      };
    }
  } catch (error) {
    return {
      id: null,
      encrypted: false
    };
  }
}
function writePersistedDeviceId(arg1) {
  try {
    const result = getDeviceIdFilePath();
    const value = encryptionAvailable() ? encodeBlob(arg1) : arg1;
    atomicWriteFile(result, value);
  } catch (error) {
    console.warn("[DeviceID] persist failed:", error.message);
  }
}
function bindOrRejectDeviceId(arg1) {
  if (!isValidDeviceId(arg1)) {
    return null;
  }
  const result = computeMachineSeal(arg1);
  const result2 = readSealFile();
  if (result2) {
    if (result2 !== result) {
      console.warn("[DeviceID] machine seal mismatch — rejecting copied device_id");
      return null;
    }
    return arg1;
  }
  writeSealFile(arg1);
  return arg1;
}
function clearDeviceIdArtifacts() {
  for (const item of [getDeviceIdFilePath(), getDeviceIdSealPath()]) {
    try {
      if (fs.existsSync(item)) {
        fs.unlinkSync(item);
      }
    } catch (error) {}
  }
}
function createAndPersistDeviceId() {
  try {
    const result = computeHardwareDeviceId();
    writePersistedDeviceId(result);
    writeSealFile(result);
    return result;
  } catch (error) {
    console.warn("[DeviceID] hardware id failed, using stable local id:", error && error.message);
    const result = crypto.randomBytes(32).toString("hex");
    writePersistedDeviceId(result);
    writeSealFile(result);
    return result;
  }
}
function getRobustDeviceID() {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }
  const {
    id: id,
    pendingDecrypt: pendingDecrypt,
    decryptFailed: decryptFailed
  } = readPersistedDeviceIdRaw();
  if (decryptFailed) {
    clearDeviceIdArtifacts();
  }
  if (pendingDecrypt) {
    try {
      const result = computeHardwareDeviceId();
      if (isValidDeviceId(result)) {
        return result;
      }
    } catch (error) {}
  }
  if (id) {
    const result = bindOrRejectDeviceId(id);
    if (result) {
      cachedDeviceId = result;
      if (encryptionAvailable()) {
        try {
          const result2 = fs.readFileSync(getDeviceIdFilePath(), "utf8").trim();
          if (!isEncryptedBlob(result2)) {
            writePersistedDeviceId(result);
          }
        } catch (error) {}
      }
      return cachedDeviceId;
    }
    clearDeviceIdArtifacts();
  }
  cachedDeviceId = createAndPersistDeviceId();
  return cachedDeviceId;
}
function migrateDeviceIdEncryption() {
  try {
    const result = getRobustDeviceID();
    if (!isValidDeviceId(result)) {
      return;
    }
    if (!readSealFile()) {
      writeSealFile(result);
    } else if (readSealFile() !== computeMachineSeal(result)) {
      console.warn("[DeviceID] migrate: seal mismatch, rotating device_id");
      cachedDeviceId = null;
      clearDeviceIdArtifacts();
      cachedDeviceId = createAndPersistDeviceId();
      return;
    }
    if (encryptionAvailable()) {
      const result2 = getDeviceIdFilePath();
      let flag = true;
      try {
        if (fs.existsSync(result2)) {
          const result3 = fs.readFileSync(result2, "utf8").trim();
          if (isEncryptedBlob(result3)) {
            try {
              flag = decodeBlob(result3).trim() !== result;
            } catch (error) {
              flag = true;
            }
          }
        }
      } catch (error) {}
      if (flag) {
        writePersistedDeviceId(result);
      }
    }
  } catch (error) {
    console.warn("[DeviceID] migrate failed:", error && error.message);
  }
}
function formatTime(arg1) {
  if (!arg1) {
    return "-";
  }
  const date = new Date(arg1);
  return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0") + " " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0");
}
module.exports = {
  getAppVersion: getAppVersion,
  getRobustDeviceID: getRobustDeviceID,
  migrateDeviceIdEncryption: migrateDeviceIdEncryption,
  formatTime: formatTime
};