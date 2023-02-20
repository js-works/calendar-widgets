import type { LitElement } from 'lit';

export type Plugin = (
  options: Partial<Shoelace.PluginOptions>
) => Partial<Shoelace.PluginOptions>;

declare global {
  namespace Shoelace {
    export interface PluginOptions {
      onComponentInit: (element: LitElement) => void;

      componentContentMapper: (
        content: unknown,
        element: LitElement
      ) => unknown;
    }
  }
}

let pluginOptionsAlreadyRead = false;
let pluginOptions: Partial<Shoelace.PluginOptions> = {};

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
  }

  pluginOptions = { ...pluginOptions, ...plugin(pluginOptions) };
}
