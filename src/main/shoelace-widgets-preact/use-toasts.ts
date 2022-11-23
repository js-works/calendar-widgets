import { h, render } from 'preact';
import type { VNode } from 'preact';
import { useState } from 'preact/hooks';
import { AbstractToastsController } from '../shared/toasts/toasts';
import { DynamicToast } from '../shared/toasts/dynamic-toast';

// === exports =======================================================

export { useToasts };

// === local classes =================================================

class ToastsController extends AbstractToastsController<VNode> {
  #toastRenderers = new Set<() => VNode>();

  constructor(
    setRenderer: (renderer: () => VNode) => void,
    forceUpdate: () => void
  ) {
    super({
      showToast: (type, config) => {
        let contentElement: HTMLElement | null;

        if (config.content) {
          contentElement = document.createElement('div');
          render(config.content, contentElement);
        }

        const renderer = () =>
          h(DynamicToast.tagName as any, {
            type,
            config,
            contentElement
          });

        this.#toastRenderers.add(renderer);
        forceUpdate();
        return Promise.resolve() as any;
      }
    });

    setRenderer(() =>
      h(
        'span',
        null,
        [...this.#toastRenderers].map((it) => it())
      )
    );
  }
}

// === exported hooks ================================================

function useToasts(): [ToastsController, () => VNode] {
  const [, setToggle] = useState(false);
  const forceUpdate = () => setToggle((it) => !it);

  const [[toastsCtrl, renderToasts]] = useState(
    (): [ToastsController, () => VNode] => {
      let renderDialogs: () => VNode;

      const toastsCtrl = new ToastsController(
        (renderer) => (renderDialogs = renderer),
        forceUpdate
      );

      return [toastsCtrl, renderDialogs!];
    }
  );

  return [toastsCtrl, renderToasts];
}
