import type { LitElement, ReactiveController } from 'lit';
import { getPluginOption } from 'shoelace-widgets';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

export { makePluginable, makeShoelaceCorePluginable };

let alreadyPatchedCore = false;

function makePluginable(constructor: typeof LitElement) {
  constructor.addInitializer((element) => {
    const controller: ReactiveController = {
      hostConnected() {
        element.removeController(controller);

        if (!element.hasAttribute('data-not-pluginable')) {
          handlePlugins(element as LitElement);
        }
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

function makeShoelaceCorePluginable() {
  if (alreadyPatchedCore) {
    return;
  }

  alreadyPatchedCore = true;

  makePluginable(Object.getPrototypeOf(SlIcon));
}
