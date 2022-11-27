import {
  createElement as h,
  useEffect,
  useRef,
  useState,
  ReactNode
} from 'react';

import { createRoot } from 'react-dom/client';

import {
  AbstractDialogsController,
  ShowDialogFunction,
  ShowToastFunction,
  StandardDialog,
  StandardToast
} from 'shoelace-widgets/internal';

// === exports =======================================================

export { useDialogs };

// === exported hooks ================================================

function useDialogs(): {
  showDialog: ShowDialogFunction<ReactNode>;
  showToast: ShowToastFunction<ReactNode>;
  renderDialogs: () => ReactNode;
} {
  const [, setDummy] = useState(0);

  const forceUpdate = () =>
    setDummy((it) => (it + 1) % Number.MAX_SAFE_INTEGER);

  return useState(() => {
    const dialogCtrl = new DialogsController(forceUpdate);

    return {
      showDialog: dialogCtrl.show.bind(dialogCtrl),
      showToast: dialogCtrl.toast.bind(dialogCtrl),
      renderDialogs: dialogCtrl.render.bind(dialogCtrl)
    };
  })[0];
}

// === local classes =================================================

class DialogsController extends AbstractDialogsController<ReactNode> {
  static {
    // required dependencies (to avoid too much tree shaking)
    void [StandardDialog, StandardToast];
  }

  readonly #forceUpdate: () => void;

  readonly #renderers: {
    id: number;
    render: () => ReactNode;
  }[] = [];

  #nextRendererId = 1;

  constructor(forceUpdate: () => void) {
    let dialogResolve: ((dialogResult: unknown) => void) | null = null;

    super({
      showDialog: (type, options) => {
        const rendererId = this.#addRenderer((key) =>
          h(
            DynamicComponent,
            {
              key,
              type: 'sx-standard-dialog--internal',
              params: {
                config: { type, ...options },

                resolve: (result: unknown) => {
                  this.#removeRenderer(rendererId);
                  dialogResolve!(result);
                }
              }
            },
            options.content
          )
        );

        return new Promise<unknown>((resolve) => {
          dialogResolve = resolve;
        }) as Promise<any>;
      },

      showToast: (type, options) => {
        let contentElement: HTMLElement | null;

        if (options.content) {
          contentElement = document.createElement('span');
          const root = createRoot(contentElement);
          root.render(options.content);
        }

        const rendererId = this.#addRenderer((key) => {
          return h(
            DynamicComponent,
            {
              key,
              type: 'sx-standard-toast--internal',
              params: {
                config: { type, ...options },
                contentElement,
                dismissToast: () => this.#removeRenderer(rendererId)
              }
            },
            options.content
          );
        });
      }
    });

    this.#forceUpdate = forceUpdate;
  }

  #addRenderer(render: (key: number) => ReactNode): number {
    const rendererId = this.#nextRendererId++;

    this.#renderers.push({
      id: rendererId,
      render: () => render(rendererId)
    });

    this.#forceUpdate();
    return rendererId;
  }

  #removeRenderer(rendererId: number) {
    const idx = this.#renderers.findIndex((it) => it.id === rendererId);
    this.#renderers.splice(idx, 1);
    this.#forceUpdate();
  }

  render() {
    return h(
      'span',
      null,
      this.#renderers.map((it) => it.render())
    );
  }
}

// === local components ==============================================

function DynamicComponent(props: {
  type: string;
  params: Record<string, unknown>;
  children?: ReactNode;
}) {
  const elemRef = useRef<HTMLElement>();

  useEffect(() => {
    Object.assign(elemRef.current!, props.params);
  }, []);

  return h(props.type, { ref: elemRef }, props.children);
}
