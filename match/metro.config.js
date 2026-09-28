const { platform } = require("node:os");
const { getDefaultConfig } = require("expo/metro-config");

// Expo's Metro fork currently selects its per-directory fallback watcher on
// Windows even though Node supports recursive fs.watch there. Large dependency
// trees can then exhaust the process handle limit before bundling starts.
if (platform() === "win32") {
  const NativeWatcher = require("@expo/metro-file-map/build/watchers/NativeWatcher").default;
  NativeWatcher.isSupported = () => true;
}

const config = getDefaultConfig(__dirname);

class MemoryCacheStore {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key.toString("hex")) ?? null;
  }

  set(key, value) {
    this.cache.set(key.toString("hex"), value);
  }

  clear() {
    this.cache.clear();
  }
}

// Windows can exhaust available file handles while Metro builds the initial
// graph, especially from a synchronized workspace. Keep transformations
// bounded as an additional safeguard without changing bundle behavior.
config.maxWorkers = 2;
config.cacheStores = [new MemoryCacheStore()];

module.exports = config;
