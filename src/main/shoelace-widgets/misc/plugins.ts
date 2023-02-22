import type { LitElement, ReactiveController } from 'lit';

// we have no legal access to Shoelace's base component class `ShoelaceElement`,
// so we retrieve it "illegally" by its subclass `SlIcon` - as soon
// as there will be a clean way to achieve the same, we'll change this - sorry ;-)
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

// === exports =======================================================

export { getPluginOption, makePluginable, pluginable, loadPlugin };
export type { Plugin };

// === types =========================================================

type Plugin = {
  id: symbol;

  // mapper function that gets the old plugin options
  // and returns new plugin options
  mapOptions: (
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
      mapRendering: (content: unknown, element: LitElement) => unknown;

      // will allow track the invocation of the `render`
      // method - useful reactive libraries like Mobx etc.
      trackRendering: (action: () => void, element: LitElement) => void;

      // this might come in near future to allow all validation messages
      // to be shown in app language (currently the standard validation
      // messages are shown in the browser's UI language).
      mapValidationMessage: (
        validationMessage: string,
        validity: ValidityState,
        element: LitElement
      ) => string;
    }
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

  if (loadedPluginIds.size === 0) {
    makePluginable(Object.getPrototypeOf(SlIcon));
  }

  pluginOptions = { ...pluginOptions, ...plugin.mapOptions(pluginOptions) };
  loadedPluginIds.add(plugin.id);
}

function pluginable(constructor: typeof LitElement) {
  makePluginable(constructor);
}

function makePluginable(constructor: typeof LitElement) {
  constructor.addInitializer((element) => {
    const controller: ReactiveController = {
      hostConnected() {
        element.removeController(controller);
        handlePlugins(element as LitElement);
      }
    };

    element.addController(controller);
  });
}

// === local helper functions ========================================

function handlePlugins(element: LitElement) {
  const onComponentInit = getPluginOption('onComponentInit');

  if (onComponentInit) {
    const controller: ReactiveController = {
      hostConnected: () => {
        element.removeController(controller);
        onComponentInit(element);
      }
    };

    element.addController(controller);
  }

  const contentMapper = getPluginOption('mapRendering');
  const tracker = getPluginOption('trackRendering');
  const elem = element as LitElement & { render: () => unknown };

  if (
    (contentMapper || tracker) &&
    'render' in element &&
    typeof elem.render === 'function'
  ) {
    const oldRender = elem.render.bind(elem);

    const render = !tracker
      ? () => oldRender()
      : () => {
          let content: unknown;

          tracker(() => {
            content = oldRender();
          }, elem);

          return content;
        };

    elem.render = () =>
      !contentMapper ? render() : contentMapper(render(), elem);
  }
}

// spellchecker:words pluginable
