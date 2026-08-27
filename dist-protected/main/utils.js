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
    const _0x35ee2b = app.isPackaged ? path.join(app.getAppPath(), "package.json") : path.join(__dirname, "..", "package.json");
    return JSON.parse(fs.readFileSync(_0x35ee2b, "utf8")).version;
  } catch (_0x534dc0) {
    return app.getVersion();
  }
}
function getDeviceIdFilePath() {
  return path.join(app.getPath("userData"), "device_id");
}
function getDeviceIdSealPath() {
  return path.join(app.getPath("userData"), "device_id.ms");
}
function isEphemeralFallbackId(_0x1b1d1f) {
  return /^fallback_id_\d+$/.test(_0x1b1d1f);
}
function isValidDeviceId(_0x50b85d) {
  if (!_0x50b85d || typeof _0x50b85d !== "string") {
    return false;
  }
  const _0xfd254 = _0x50b85d.trim();
  if (_0xfd254.length < 16 || _0xfd254.length > 128) {
    return false;
  }
  if (isEphemeralFallbackId(_0xfd254)) {
    return false;
  }
  return /^[a-f0-9]+$/i.test(_0xfd254);
}
function isEncryptedBlob(_0x3a1bb5) {
  return typeof _0x3a1bb5 === "string" && _0x3a1bb5.startsWith(BLOB_PREFIX);
}
function encryptionAvailable() {
  try {
    const {
      safeStorage: _0x1611f3
    } = require("electron");
    if (typeof app.isReady === "function" && !app.isReady()) {
      return false;
    }
    return !!_0x1611f3 && typeof _0x1611f3.isEncryptionAvailable === "function" && !!_0x1611f3.isEncryptionAvailable();
  } catch (_0x37f7b3) {
    return false;
  }
}
function encodeBlob(_0x6b12af) {
  const {
    safeStorage: _0x1f0ebc
  } = require("electron");
  const _0x1563a5 = _0x1f0ebc.encryptString(String(_0x6b12af));
  return BLOB_PREFIX + Buffer.from(_0x1563a5).toString("base64");
}
function decodeBlob(_0x4894f0) {
  const {
    safeStorage: _0x1f6422
  } = require("electron");
  const _0x327d50 = String(_0x4894f0).slice(BLOB_PREFIX.length);
  const _0x5e6420 = Buffer.from(_0x327d50, "base64");
  return _0x1f6422.decryptString(_0x5e6420);
}
function computeHardwareDeviceId() {
  const _0x504cf2 = machineIdSync();
  const _0x5c4a7d = require("os");
  const _0x4b8638 = _0x5c4a7d.cpus()[0]?.model || "unknown_cpu";
  const _0x5aa993 = _0x5c4a7d.totalmem().toString();
  return crypto.createHash("sha256").update(_0x504cf2 + _0x4b8638 + _0x5aa993).digest("hex");
}
function computeMachineSeal(_0x3136a7) {
  return crypto.createHash("sha256").update(machineIdSync() + "\n" + _0x3136a7).digest("hex");
}
function readSealFile() {
  try {
    const _0x4f2835 = getDeviceIdSealPath();
    if (!fs.existsSync(_0x4f2835)) {
      return null;
    }
    const _0x1595b2 = fs.readFileSync(_0x4f2835, "utf8").trim();
    if (/^[a-f0-9]{64}$/i.test(_0x1595b2)) {
      return _0x1595b2.toLowerCase();
    } else {
      return null;
    }
  } catch (_0x284776) {
    return null;
  }
}
function writeSealFile(_0x63583) {
  try {
    const _0x4fad6c = app.getPath("userData");
    fs.mkdirSync(_0x4fad6c, {
      recursive: true
    });
    const _0x178e08 = getDeviceIdSealPath();
    const _0x2f63aa = _0x178e08 + "." + process.pid + ".tmp";
    fs.writeFileSync(_0x2f63aa, computeMachineSeal(_0x63583), "utf8");
    fs.renameSync(_0x2f63aa, _0x178e08);
  } catch (_0x309895) {
    console.warn("[DeviceID] seal persist failed:", _0x309895.message);
  }
}
function atomicWriteFile(_0x74c127, _0x980d40) {
  const _0x1974ed = path.dirname(_0x74c127);
  fs.mkdirSync(_0x1974ed, {
    recursive: true
  });
  const _0x43fbe7 = _0x74c127 + "." + process.pid + ".tmp";
  fs.writeFileSync(_0x43fbe7, _0x980d40, "utf8");
  fs.renameSync(_0x43fbe7, _0x74c127);
}
function readPersistedDeviceIdRaw() {
  try {
    const _0x58e586 = getDeviceIdFilePath();
    if (!fs.existsSync(_0x58e586)) {
      return {
        id: null,
        encrypted: false
      };
    }
    const _0x7f71b5 = fs.readFileSync(_0x58e586, "utf8").trim();
    if (!_0x7f71b5) {
      return {
        id: null,
        encrypted: false
      };
    }
    if (isEncryptedBlob(_0x7f71b5)) {
      if (!encryptionAvailable()) {
        return {
          id: null,
          encrypted: true,
          pendingDecrypt: true,
          blob: _0x7f71b5
        };
      }
      try {
        const _0x53e03b = decodeBlob(_0x7f71b5).trim();
        if (isValidDeviceId(_0x53e03b)) {
          return {
            id: _0x53e03b,
            encrypted: true
          };
        } else {
          return {
            id: null,
            encrypted: true
          };
        }
      } catch (_0x1f02ab) {
        console.warn("[DeviceID] decrypt failed (possible cross-machine copy):", _0x1f02ab.message);
        return {
          id: null,
          encrypted: true,
          decryptFailed: true
        };
      }
    }
    if (isValidDeviceId(_0x7f71b5)) {
      return {
        id: _0x7f71b5,
        encrypted: false
      };
    } else {
      return {
        id: null,
        encrypted: false
      };
    }
  } catch (_0x183823) {
    return {
      id: null,
      encrypted: false
    };
  }
}
function writePersistedDeviceId(_0x290308) {
  try {
    const _0x225906 = getDeviceIdFilePath();
    const _0x1ce15f = encryptionAvailable() ? encodeBlob(_0x290308) : _0x290308;
    atomicWriteFile(_0x225906, _0x1ce15f);
  } catch (_0x4600f7) {
    console.warn("[DeviceID] persist failed:", _0x4600f7.message);
  }
}
function bindOrRejectDeviceId(_0x1e0e70) {
  if (!isValidDeviceId(_0x1e0e70)) {
    return null;
  }
  const _0x35c33d = computeMachineSeal(_0x1e0e70);
  const _0x282140 = readSealFile();
  if (_0x282140) {
    if (_0x282140 !== _0x35c33d) {
      console.warn("[DeviceID] machine seal mismatch — rejecting copied device_id");
      return null;
    }
    return _0x1e0e70;
  }
  writeSealFile(_0x1e0e70);
  return _0x1e0e70;
}
function clearDeviceIdArtifacts() {
  for (const _0x392d42 of [getDeviceIdFilePath(), getDeviceIdSealPath()]) {
    try {
      if (fs.existsSync(_0x392d42)) {
        fs.unlinkSync(_0x392d42);
      }
    } catch (_0x4ce1af) {}
  }
}
function createAndPersistDeviceId() {
  try {
    const _0x23896c = computeHardwareDeviceId();
    writePersistedDeviceId(_0x23896c);
    writeSealFile(_0x23896c);
    return _0x23896c;
  } catch (_0x3edc48) {
    console.warn("[DeviceID] hardware id failed, using stable local id:", _0x3edc48 && _0x3edc48.message);
    const _0x59f921 = crypto.randomBytes(32).toString("hex");
    writePersistedDeviceId(_0x59f921);
    writeSealFile(_0x59f921);
    return _0x59f921;
  }
}
function getRobustDeviceID() {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }
  const {
    id: _0x532ba5,
    pendingDecrypt: _0x444f8d,
    decryptFailed: _0x407069
  } = readPersistedDeviceIdRaw();
  if (_0x407069) {
    clearDeviceIdArtifacts();
  }
  if (_0x444f8d) {
    try {
      const _0x38b716 = computeHardwareDeviceId();
      if (isValidDeviceId(_0x38b716)) {
        return _0x38b716;
      }
    } catch (_0x450836) {}
  }
  if (_0x532ba5) {
    const _0x3fe3e4 = bindOrRejectDeviceId(_0x532ba5);
    if (_0x3fe3e4) {
      cachedDeviceId = _0x3fe3e4;
      if (encryptionAvailable()) {
        try {
          const _0x1deca8 = fs.readFileSync(getDeviceIdFilePath(), "utf8").trim();
          if (!isEncryptedBlob(_0x1deca8)) {
            writePersistedDeviceId(_0x3fe3e4);
          }
        } catch (_0x1613e7) {}
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
    const _0x169294 = getRobustDeviceID();
    if (!isValidDeviceId(_0x169294)) {
      return;
    }
    if (!readSealFile()) {
      writeSealFile(_0x169294);
    } else if (readSealFile() !== computeMachineSeal(_0x169294)) {
      console.warn("[DeviceID] migrate: seal mismatch, rotating device_id");
      cachedDeviceId = null;
      clearDeviceIdArtifacts();
      cachedDeviceId = createAndPersistDeviceId();
      return;
    }
    if (encryptionAvailable()) {
      const _0x8c4b0 = getDeviceIdFilePath();
      let _0x5df282 = true;
      try {
        if (fs.existsSync(_0x8c4b0)) {
          const _0xa6e67a = fs.readFileSync(_0x8c4b0, "utf8").trim();
          if (isEncryptedBlob(_0xa6e67a)) {
            try {
              _0x5df282 = decodeBlob(_0xa6e67a).trim() !== _0x169294;
            } catch (_0x3b9182) {
              _0x5df282 = true;
            }
          }
        }
      } catch (_0x134223) {}
      if (_0x5df282) {
        writePersistedDeviceId(_0x169294);
      }
    }
  } catch (_0x13b921) {
    console.warn("[DeviceID] migrate failed:", _0x13b921 && _0x13b921.message);
  }
}
function formatTime(_0x2b193d) {
  if (!_0x2b193d) {
    return "-";
  }
  const _0x335762 = new Date(_0x2b193d);
  return _0x335762.getFullYear() + "-" + (_0x335762.getMonth() + 1).toString().padStart(2, "0") + "-" + _0x335762.getDate().toString().padStart(2, "0") + " " + _0x335762.getHours().toString().padStart(2, "0") + ":" + _0x335762.getMinutes().toString().padStart(2, "0") + ":" + _0x335762.getSeconds().toString().padStart(2, "0");
}
module.exports = {
  getAppVersion: getAppVersion,
  getRobustDeviceID: getRobustDeviceID,
  migrateDeviceIdEncryption: migrateDeviceIdEncryption,
  formatTime: formatTime
};