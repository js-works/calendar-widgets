// === exports =======================================================

export { getPluginOption, loadPlugin };
export type { Plugin };

// === types =========================================================

type Plugin = {
  id: symbol;

  onLoad?: () => void;

  // mapper function that gets the old plugin options
  // and returns new plugin options
  mapOptions: (
    options: Partial<Shoelace.PluginOptions>
  ) => Partial<Shoelace.PluginOptions>;
};

declare global {
  namespace Shoelace {
    interface PluginOptions {}
  }
}

// === local variables ===============================================

let pluginOptions: Partial<Shoelace.PluginOptions> = {};
let pluginOptionsAlreadyRead = false;
let loadedPluginIds = new Set<symbol>();

// === exported functions =============================================

function getPluginOption<K extends keyof Shoelace.PluginOptions>(
  key: K
): Shoelace.PluginOptions[K] | undefined {
  pluginOptionsAlreadyRead = true;
  return pluginOptions[key];
}

function loadPlugin(plugin: Plugin) {
  if (pluginOptionsAlreadyRead) {
    throw new Error(
      'Function `loadPlugin` must not be called after method `getPluginOptions` has already been called'
    );
  } else if (loadedPluginIds.has(plugin.id)) {
    throw new Error(
      `Plugin "${plugin.id.description}" has already been loaded`
    );
  }

  pluginOptions = { ...pluginOptions, ...plugin.mapOptions(pluginOptions) };
  loadedPluginIds.add(plugin.id);
  plugin.onLoad?.();
}
