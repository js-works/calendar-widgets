import { h, render, VNode } from 'preact';
import { useState } from 'preact/hooks';
import { AbstractToastsController } from '../shoelace-widgets/controllers/vanilla/toasts';

export { useToasts };

class ToastsController extends AbstractToastsController<VNode> {
  #renderers = new Set<() => VNode>();

  constructor(
    setRenderer: (renderer: () => VNode) => void,
    forceUpdate: () => void
  ) {
    super({
      showToast: (config) => {
        let contentElement: HTMLElement | null;

        if (config.content) {
          contentElement = document.createElement('div');
          render(config.content, contentElement);
        }

        const renderer = () =>
          h(
            'dyn-toast' as any,
            {
              config,
              contentElement
            },
            config.content
          );

        this.#renderers.add(renderer);
        forceUpdate();
        return Promise.resolve() as any;
      }
    });

    setRenderer(() =>
      h(
        'span',
        null,
        [...this.#renderers].map((it) => it())
      )
    );
  }
}

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
