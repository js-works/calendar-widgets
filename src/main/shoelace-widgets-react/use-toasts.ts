import { createElement as h, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { AbstractToastsController } from '../shoelace-widgets/controllers/vanilla/toasts';

export { useToasts };

class ToastsController extends AbstractToastsController<ReactNode> {
  #renderers = new Set<() => ReactNode>();

  constructor(
    setRenderer: (renderer: () => ReactNode) => void,
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

        const renderer = () => h(DynToast, { type, config });

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

function DynToast(props: { type: any; config: any }) {
  // TODO
  const elemRef = useRef<any>();

  useEffect(() => {
    let contentElement: HTMLElement | null = null;

    if (props.config.content) {
      contentElement = document.createElement('div');
      const root = createRoot(contentElement);
      root.render(props.config.content);
    }

    elemRef.current!.type = props.type;
    elemRef.current!.config = props.config;
    elemRef.current!.contentElement = contentElement;
  }, []);

  return h('dyn-toast', { ref: elemRef });
}
