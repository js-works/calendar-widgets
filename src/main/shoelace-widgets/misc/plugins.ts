import type { LitElement } from 'lit';

export type Plugin = {
  id: symbol;

  // mapper function that gets the old plugin options
  // and returns new plugin options
  optionsMapper: (
    options: Partial<Shoelace.PluginOptions>
  ) => Partial<Shoelace.PluginOptions>;
};

declare global {
  namespace Shoelace {
    interface PluginOptions {
      // will be called each time a component is initialized
      onComponentInit: (element: LitElement) => void;

      // will be used to map the return value of the component's
      // `render` function
      componentContentMapper: (
        content: unknown,
        element: LitElement
      ) => unknown;

      // this might come in near future to allow all validation messages
      // to be shown in app language (currently the standard validation
      // messages are shown in the browser's UI language).
      validationMessageMapper: (
        validationMessage: string,
        validity: ValidityState,
        element: LitElement
      ) => string;
    }
  }
}

let pluginOptions: Partial<Shoelace.PluginOptions> = {};
let pluginOptionsAlreadyRead = false;
let loadedPluginIds = new Set<symbol>();

export function getPluginOption<K extends keyof Shoelace.PluginOptions>(
  key: K
): Shoelace.PluginOptions[K] | undefined {
  pluginOptionsAlreadyRead = true;
  return pluginOptions[key];
}

export function loadPlugin(plugin: Plugin) {
  if (pluginOptionsAlreadyRead) {
    throw new Error(
      'Function `loadPlugin` must not be called after method `getPluginOptions` has already been called'
    );
  } else if (loadedPluginIds.has(plugin.id)) {
    throw new Error(
      `Plugin "${plugin.id.description}" has already been loaded`
    );
  }

  pluginOptions = { ...pluginOptions, ...plugin.optionsMapper(pluginOptions) };
  loadedPluginIds.add(plugin.id);
}
