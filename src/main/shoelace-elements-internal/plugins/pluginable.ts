import type { LitElement, ReactiveController } from 'lit';
import { getPluginOption } from 'shoelace-elements';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon';

export { makeElementPluginable, makeShoelaceCorePluginable };

let alreadyPatchedShoelaceCore = false;

function makeShoelaceCorePluginable() {
  if (alreadyPatchedShoelaceCore) {
    return;
  }

  makeElementClassPluginable(Object.getPrototypeOf(SlIcon));
  alreadyPatchedShoelaceCore = true;
}

function makeElementClassPluginable(constructor: typeof LitElement) {
  constructor.addInitializer((element) => {
    const controller: ReactiveController = {
      hostConnected() {
        element.removeController(controller);

        if (!element.hasAttribute('data-not-pluginable')) {
          makeElementPluginable(element as LitElement);
        }
      }
    };

    element.addController(controller);
  });
}

function makeElementPluginable(element: LitElement) {
  const config = getPluginOption('shoelace-elements/lit');
  const onElementInit = config?.onElementInit;

  if (onElementInit) {
    const controller: ReactiveController = {
      hostConnected: () => {
        element.removeController(controller);
        onElementInit(element);
      }
    };

    element.addController(controller);
  }

  const mapFormFieldContent = config?.mapFormFieldContent;
  const trackRendering = config?.trackRendering;
  const elem = element as LitElement & { render: () => unknown };

  if (
    (mapFormFieldContent || trackRendering) &&
    'render' in element &&
    typeof elem.render === 'function'
  ) {
    const oldRender = elem.render.bind(elem);

    const render = !trackRendering
      ? () => oldRender()
      : () => {
          let content: unknown;

          trackRendering(() => {
            content = oldRender();
          }, elem);

          return content;
        };

    elem.render = () =>
      !mapFormFieldContent ? render() : mapFormFieldContent(render(), elem);
  }
}
