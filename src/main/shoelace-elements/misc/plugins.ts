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
    options: Partial<ShoelaceElements.PluginOptions>
  ) => Partial<ShoelaceElements.PluginOptions>;
};

declare global {
  namespace ShoelaceElements {
    interface PluginOptions {}
  }
}

// === local variables ===============================================

let pluginOptions: Partial<ShoelaceElements.PluginOptions> = {};
let pluginOptionsAlreadyRead = false;
let loadedPluginIds = new Set<symbol>();

// === exported functions =============================================

function getPluginOption<K extends keyof ShoelaceElements.PluginOptions>(
  key: K
): ShoelaceElements.PluginOptions[K] | undefined {
  pluginOptionsAlreadyRead = true;
  return pluginOptions[key];
}

function loadPlugin(plugin: Plugin) {
  if (pluginOptionsAlreadyRead) {
    throw new Error(
      'Function `loadPlugin` must not be called after method `getPluginOptions` has already been called'
    );
  }

  if (loadedPluginIds.has(plugin.id)) {
    return;
  }

  pluginOptions = { ...pluginOptions, ...plugin.mapOptions(pluginOptions) };
  loadedPluginIds.add(plugin.id);
  plugin.onLoad?.();
}
