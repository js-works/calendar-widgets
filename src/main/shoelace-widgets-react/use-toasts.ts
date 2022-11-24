import { createElement as h, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  AbstractToastsController,
  ToastConfig,
  ToastType
} from '../shared/toasts/abstract-toasts-controller';

import { DynamicToast } from '../shared/toasts/dynamic-toast';

// === exports =======================================================

export { useToasts };

// === local classes =================================================

class ToastsController extends AbstractToastsController<ReactNode> {
  #renderers = new Set<() => ReactNode>();

  static {
    // dependencies to prevent to much tree shaking
    void [DynamicToast];
  }

  constructor(
    supplyRenderer: (renderer: () => ReactNode) => void,
    forceUpdate: () => void
  ) {
    super({
      showToast: (type, config) => {
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

        const renderer = () => h(DynToast, { type, config, dismissToast });

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
  type: ToastType;
  config: ToastConfig<ReactNode>;
  dismissToast: () => void;
}) {
  const dynamicToastRef = useRef<DynamicToast>();

  useEffect(() => {
    let contentElement: HTMLElement | null = null;

    if (props.config.content) {
      contentElement = document.createElement('div');
      const root = createRoot(contentElement);
      root.render(props.config.content);
    }

    Object.assign(dynamicToastRef.current!, {
      type: props.type,
      config: props.config,
      contentElement: contentElement,
      dismissToast: props.dismissToast
    });
  }, []);

  return h(DynamicToast.tagName, { ref: dynamicToastRef });
}
