import { createElement as h, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  AbstractToastsController,
  ToastConfig,
  ToastType
} from '../shoelace-widgets-internal/controllers/abstract-toasts-controller';

import { StandardToast } from 'shoelace-widgets/internal';

// === exports =======================================================

export { useToasts };

// === local classes =================================================

class ToastsController extends AbstractToastsController<ReactNode> {
  #renderers = new Set<() => ReactNode>();

  static {
    // required components (to prevent to much tree shaking)
    void [StandardToast];
  }

  constructor(
    supplyRenderer: (renderer: () => ReactNode) => void,
    forceUpdate: () => void
  ) {
    super({
      showToast: (config) => {
        let contentElement: HTMLElement | null;

        if (config.content) {
          contentElement = document.createElement('div');
          const root = createRoot(contentElement);
          root.render(config.content);
        }

        const dismissToast = () => {
          this.#renderers.delete(renderer);
          forceUpdate();
        };

        const renderer = () => h(DynToast, { config, dismissToast });

        this.#renderers.add(renderer);
        forceUpdate();
      }
    });

    supplyRenderer(() =>
      h(
        'span',
        null,
        [...this.#renderers].map((it) => it())
      )
    );
  }
}

// === public hooks ==================================================

function useToasts(): [ToastsController, () => ReactNode] {
  const [, setToggle] = useState(false);
  const forceUpdate = () => setToggle((it) => !it);

  const [[toastsCtrl, renderToasts]] = useState(
    (): [ToastsController, () => ReactNode] => {
      let renderDialogs: () => ReactNode;

      const toastsCtrl = new ToastsController(
        (renderer) => (renderDialogs = renderer),
        forceUpdate
      );

      return [toastsCtrl, renderDialogs!];
    }
  );

  return [toastsCtrl, renderToasts];
}

// === local components ==============================================

function DynToast(props: {
  config: ToastConfig<ReactNode>;
  dismissToast: () => void;
}) {
  const dynamicToastRef = useRef<StandardToast>();

  useEffect(() => {
    let contentElement: HTMLElement | null = null;

    if (props.config.content) {
      contentElement = document.createElement('div');
      const root = createRoot(contentElement);
      root.render(props.config.content);
    }

    Object.assign(dynamicToastRef.current!, {
      config: props.config,
      contentElement: contentElement,
      dismissToast: props.dismissToast
    });
  }, []);

  return h('sx-standard-toast', { ref: dynamicToastRef });
}
