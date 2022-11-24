import { h, render, VNode } from 'preact';
import { useState } from 'preact/hooks';
import { AbstractToastsController } from '../shoelace-widgets-internal/controllers/abstract-toasts-controller';
import { StandardToast } from 'shoelace-widgets/internal';

// === exports =======================================================

export { useToasts };

// === local classes =================================================

class ToastsController extends AbstractToastsController<VNode> {
  #toastRenderers = new Set<() => VNode>();

  constructor(
    supplyRenderer: (renderer: () => VNode) => void,
    forceUpdate: () => void
  ) {
    super({
      showToast: (config) => {
        let contentElement: HTMLElement | null;

        if (config.content) {
          contentElement = document.createElement('div');
          render(config.content, contentElement);
        }

        const dismissToast = () => {
          this.#toastRenderers.delete(renderer);
          forceUpdate();
        };

        const renderer = () =>
          h('sx-standard-toast' as unknown as any, {
            config,
            contentElement,
            dismissToast
          });

        this.#toastRenderers.add(renderer);
        forceUpdate();
      }
    });

    supplyRenderer(() =>
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
      let renderToasts: () => VNode;

      const toastsCtrl = new ToastsController(
        (renderer) => (renderToasts = renderer),
        forceUpdate
      );

      return [toastsCtrl, renderToasts!];
    }
  );

  return [toastsCtrl, renderToasts];
}
